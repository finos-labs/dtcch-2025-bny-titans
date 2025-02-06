import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.cluster import MiniBatchKMeans
from sklearn.ensemble import IsolationForest
from sklearn.decomposition import PCA
from Util.Utils import get_response_from_llm

def feature_selection_modelling(df):
    features = ['Quantity', 'Direction', 'Time_Diff', 'Amount_Anomaly', 'Frequent_Trades', 'Settlement_Delays']
    
    df['Direction'] = df['Direction'].apply(lambda x: 1 if x == 'Buy' else 0)
    
    # Calculate mean and standard deviation of transaction amounts for each client
    client_stats = df.groupby('Customer_Legal_Identifier')['Principal_Amount'].agg(['mean', 'std']).reset_index()

    # Merge the statistics back to the original dataframe
    df = df.merge(client_stats, on='Customer_Legal_Identifier', how='left')

    df['Amount_Anomaly'] = (df['Principal_Amount'] > (df['mean'] + 0.2 * df['std'])) | (df['Principal_Amount'] < (df['mean'] - 0.2 * df['std']))
    
    # Settlement Delays (Assuming T+2 settlement cycle)
    df['Settlement_Delays'] = (df['Transaction_Date'] + pd.Timedelta(days=2)) < pd.to_datetime(df['Execution_Timestamp'].dt.date)

    # Frequency and timing of trades
    df['Trade_Frequency'] = df.groupby('Account_ID')['Tag_Number'].transform('count')
    df['Frequent_Trades'] = df['Trade_Frequency'] > (df['Trade_Frequency'].mean() + 2 * df['Trade_Frequency'].std())
    
    df[features] = df[features].fillna(df[features].mean())

    # Label encode the 'Instrument_Name' column
    le = LabelEncoder()
    df['Instrument_Name_Encoded'] = le.fit_transform(df['Instrument_Name'])

    # Update features to include the encoded 'Instrument_Name' column
    features.append('Instrument_Name_Encoded')

    # Normalize the data
    scaler = StandardScaler()
    X = scaler.fit_transform(df[features])

    # Reduce dimensionality with PCA
    pca = PCA(n_components=6)
    X_reduced = pca.fit_transform(X)
    
    input_sheet = df[features + ['Instrument_Name', 'Execution_Timestamp', 'Announcement_Date', 'BRx_Transaction_ID', 'Account_ID', 'Pre_Announcement_Window', 'Announcement_Details']]
    
    # Clustering with MiniBatchKMeans on reduced data
    minibatch_kmeans = MiniBatchKMeans(n_clusters=2, batch_size=1000)
    minibatch_kmeans.fit(X_reduced)
    clusters_reduced = minibatch_kmeans.predict(X_reduced)
    df['Cluster'] = clusters_reduced

    # Anomaly detection with Isolation Forest on reduced data
    iso_forest = IsolationForest(contamination=0.05)
    anomalies_reduced = iso_forest.fit_predict(X_reduced)
    df['Anomaly'] = anomalies_reduced

    # Filter potential insider trading anomalies
    output_sheet = df[df['Anomaly'] == -1]
    
    output_sheet = output_sheet[features + ['Instrument_Name', 'Execution_Timestamp', 'Announcement_Date', 'BRx_Transaction_ID', 'Account_ID', 'Pre_Announcement_Window', 'Announcement_Details']]
    output_sheet = output_sheet[output_sheet['Pre_Announcement_Window'] == True]
    
    return input_sheet, output_sheet, X_reduced
    

def explain_anomaly(df_input, df_output, row):
    data = df_output.iloc[row]
    account_id = data['Account_ID']
    instrument = data['Instrument_Name']
    direction = data['Direction']

    dropped_cols = ['BRx_Transaction_ID', 'Instrument_Name', 'Time_Diff', 'Execution_Timestamp', 'Instrument_Name_Encoded']
    
    data = data.drop(dropped_cols)
    
    df_input = df_input[(df_input['Account_ID'] == account_id) & (df_input['Direction'] == direction) & (df_input['Instrument_Name'] == instrument)]
    df_input = df_input.drop(dropped_cols + ['Account_ID', 'Direction', 'Instrument_Name'], axis=1)

    # Convert the dataframe to a string representation
    df_input_str = df_input.to_string(index=False)
    df_output_str = data.to_string()

    with open('Prompts/explain_anomaly_prompt.txt', 'r') as file:
        prompt = file.read()

    prompt = prompt.format(df_output_str, df_input_str)
    response = get_response_from_llm(prompt)
    
    return response, prompt