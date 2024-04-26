import json
from sklearn.model_selection import train_test_split

def split_json_dataset(dataset, test_size=0.2, random_state=None):
    train_set, test_set = train_test_split(dataset, test_size=test_size, random_state=random_state)
    return train_set, test_set