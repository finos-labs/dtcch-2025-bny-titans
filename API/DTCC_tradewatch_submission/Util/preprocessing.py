import pandas as pd
from datetime import datetime, timedelta
import re
from Util.Utils import get_response_from_llm

def getAnnouncements(company_name, startDate='2018-01-01', endDate='2025-05-01'):
    with open('Prompts/announcement_generation_prompt.txt', 'r') as file:
        prompt = file.read()
        
    prompt = prompt.format(company_name, startDate, endDate)
    response = get_response_from_llm(prompt)
    
    return response

def extract_announcements(news_string):
    # Regular expression to match the date and headline
    pattern = r'\{\s*"date":\s*"([^"]+)",\s*"headline":\s*"([^"]+)"'
    
    # Find all matches in the string
    matches = re.findall(pattern, news_string)
    
    # Format the matches into the desired list format
    announcement_list = [(date, headline) for date, headline in matches]
    
    return announcement_list

def company_news(company_name):
    news = getAnnouncements(company_name)
    announcement_list = extract_announcements(news)
    return announcement_list

def populate_announcement(df):
    unique_comapnies = df['Instrument_Name'].unique().tolist()
    announcement_dict = {}
    for company in unique_comapnies:
        announcement_dict[company] = company_news(company)

    return announcement_dict

def find_closest_announcement(transaction_date, announcement_list):
    valid_dates = []
    for date, detail in announcement_list:
        try:
            valid_dates.append((datetime.strptime(date, '%Y-%m-%d'), detail))
        except ValueError:
            continue  # Skip invalid dates

    future_dates = [(date, detail) for date, detail in valid_dates if date > transaction_date]
    current_date = datetime.today() + timedelta(days=60)
    
    if not future_dates:
        return current_date, "No future announcements found"  # Return the current date if no future dates are found
        
    closest_date, closest_detail = min(future_dates, key=lambda x: abs(x[0] - transaction_date))
    return closest_date, closest_detail

def preprocessing(df, pre_announcement_window_days = 30):
    df['Execution_Timestamp'] = pd.to_datetime(df['Execution_Timestamp'])
    df['Transaction_Date'] = pd.to_datetime(df['Transaction_Date'])
    
    announcement_dict = populate_announcement(df)
    
    df[['Announcement_Date', 'Announcement_Details']] = df.apply(
    lambda row: find_closest_announcement(row['Transaction_Date'], announcement_dict.get(row['Instrument_Name'], [])), axis=1, result_type='expand'
    )
    
    df['Announcement_Details'] = df.apply(
    lambda x: "No announcement was made in the next 30 days" if (x['Announcement_Date'] - x['Transaction_Date']).days > 30 else x['Announcement_Details'], axis=1
    )
    
    df['Announcement_Date'] = pd.to_datetime(df['Announcement_Date'])
    
    df['Time_Diff'] = (df['Execution_Timestamp'] - df['Announcement_Date']).dt.days
    
    df['Pre_Announcement_Window'] = df['Time_Diff'].apply(lambda x: -pre_announcement_window_days <= x <= 0)
    
    return df