import matplotlib.pyplot as plt
import seaborn as sns

def plot_data(df, X_reduced):
    # Plotting
    plt.figure(figsize=(14, 7))

    # Scatter plot of PCA components colored by cluster
    plt.subplot(1, 2, 1)
    sns.scatterplot(x=X_reduced[:, 0], y=X_reduced[:, 1], hue=df['Cluster'], palette='tab10')
    plt.title('PCA Components with Clusters')
    plt.xlabel('PCA Component 1')
    plt.ylabel('PCA Component 2')

    # Scatter plot of PCA components colored by anomaly
    plt.subplot(1, 2, 2)
    sns.scatterplot(x=X_reduced[:, 0], y=X_reduced[:, 1], hue=df['Anomaly'], palette={1: 'blue', -1: 'red'})
    plt.title('PCA Components with Anomalies')
    plt.xlabel('PCA Component 1')
    plt.ylabel('PCA Component 2')

    plt.tight_layout()
    plt.show()

    # Additional plots with more visible colors
    plt.figure(figsize=(14, 7))

    # Custom color palette
    palette = {1: 'green', -1: 'orange'}

    # Histogram of Quantity
    plt.subplot(1, 2, 1)
    sns.histplot(df, x='Quantity', hue='Anomaly', multiple='stack', palette=palette)
    plt.title('Histogram of Quantity by Anomaly')
    plt.xlabel('Quantity')
    plt.ylabel('Count')

    # Histogram of Execution_Price
    plt.subplot(1, 2, 2)
    sns.histplot(df, x='Execution_Price', hue='Anomaly', multiple='stack', palette=palette)
    plt.title('Histogram of Execution_Price by Anomaly')
    plt.xlabel('Execution_Price')
    plt.ylabel('Count')

    plt.tight_layout()
    plt.show()