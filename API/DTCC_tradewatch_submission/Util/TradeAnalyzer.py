from Util.preprocessing import preprocessing
from Util.analysis import feature_selection_modelling, explain_anomaly
# from plotting import plot_data
import pandas as pd

class TradeAnalyzer:
    def __init__(self, data_path, pre_announcement_window_days=30):
        self.data_path = data_path
        self.pre_announcement_window_days = pre_announcement_window_days
        self.df = None
        self.X_reduced = None
        self.input_sheet = None
        self.output_sheet = None

    def load_data(self):
        self.df = pd.read_csv(self.data_path)

    def preprocess(self):
        self.df = preprocessing(self.df, self.pre_announcement_window_days)

    def analyze(self):
        self.input_sheet, self.output_sheet, self.X_reduced = feature_selection_modelling(self.df)

    def plot(self):
        plot_data(self.df, self.X_reduced)

    def explain_anomaly(self, row):
        return explain_anomaly(self.input_sheet, self.output_sheet, row)

    def get_data_as_json(self):
        return self.df.to_json(orient='records')

    def get_input_sheet_as_json(self):
        return self.input_sheet.to_json(orient='records')

    def get_output_sheet_as_json(self):
        return self.output_sheet.to_json(orient='records')