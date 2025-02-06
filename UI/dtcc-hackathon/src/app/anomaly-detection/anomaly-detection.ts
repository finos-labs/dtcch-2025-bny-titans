export enum AnomalyDetectionSource {
    TRANSACTIONS = 'Transactions',
    CORPORATE_ACTIONS = 'Corporate Actions',
    ANOMALY_DETECTION = 'Anomalies'
}

export interface AnomalyDetectionDetails {
    prompt: string;
    response: string;
}

export interface AnomalyDetectionResponse {
    output_sheet: string;
}

export interface AnomalyDetectionRow {
    Account_ID: string;
    Amount_Anomaly: boolean;
    Announcement_Date: number;
    Announcement_Details: string;
    BRx_Transaction_ID: string;
    Direction: number;
    Execution_Timestamp: number;
    Frequent_Trades: boolean;
    Instrument_Name: string;
    Pre_Announcement_Window: boolean;
    Quantity: number;
    Settlement_Delays: boolean;
    Time_Diff: number;
    rowNumber: number;
}