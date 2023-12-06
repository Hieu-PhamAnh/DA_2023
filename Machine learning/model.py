import numpy as np
import scipy as sp
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.offline as py
import plotly.graph_objects as go
from plotly import tools
from plotly.offline import download_plotlyjs, init_notebook_mode, plot, iplot
import cufflinks as cf
import warnings
warnings.filterwarnings('ignore')

init_notebook_mode(connected=True)
cf.go_offline()

path = "/content/drive/MyDrive/Colab Notebooks/data/FIFA19_official_data.csv"
data = pd.read_csv(path)

data.drop(columns=['ID', 'Photo', 'Flag', 'Value', 'Wage', 'Club Logo', 'Special', 'Real Face', 'Release Clause',
                   'Joined', 'Contract Valid Until'], inplace=True)
data.drop(columns=['Loaned From'], inplace=True)
data.drop(columns=['Club', 'Position', 'Jersey Number'], inplace=True)

def height_converter(val):
    f = val.split("'")[0]
    i = val.split("'")[1]
    h = (int(f) * 30.48) + (int(i)*2.54)
    return round(h)

def weight_converter(val):
    wlbs = int(val.split('lbs')[0])
    wkg = int(wlbs * 0.45359237)
    return wkg

data['Height in Cms'] = data['Height'].apply(height_converter)
data['Weight in Kgs'] = data['Weight'].apply(weight_converter)

data.drop(columns=['Height', 'Weight'], inplace=True)

data['Body Type'][data['Body Type'] == 'Messi'] = 'Lean'
data['Body Type'][data['Body Type'] == 'C. Ronaldo'] = 'Normal'
data['Body Type'][data['Body Type'] == 'Neymar'] = 'Lean'
data['Body Type'][data['Body Type'] == 'Courtois'] = 'Lean'
data['Body Type'][data['Body Type'] == 'Mohamed Salah'] = 'Normal'
data['Body Type'][data['Body Type'] == 'Shaqiri'] = 'Stocky'
data['Body Type'][data['Body Type'] == 'Akinfenwa'] = 'Stocky'
def bodyType_converter(val):
    bt = val.split(' ')[0]
    return bt
data['Body Type'] = data['Body Type'].apply(bodyType_converter)

def position_simplifier(val):
    if val == 'RW' or val == 'ST' or val == 'LW' or val == 'CF':
        val = 'F'
        return val
    elif val == 'LM' or val == 'CAM' or val == 'CDM' or val == 'RM' or  val == 'CM':
        val = 'M'
        return val
    elif val == 'CB' or val == 'LB' or val == 'RB' or val == 'RWB' or val == 'LWB':
        val = 'D'
        return val
    else:
        return val
data['Best Position'] = data['Best Position'].apply(position_simplifier)

from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.ensemble import GradientBoostingClassifier, GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, mean_squared_error, r2_score

def pos_numeric(val):
    if val == 'GK':
        return 0
    elif val == 'D':
        return 1
    elif val == 'M':
        return 2
    else:
        return 3

data['Best Position'] = data['Best Position'].apply(pos_numeric)

data.drop(columns=['Age', 'Best Overall Rating',
                    'Jumping' , 'Overall',
                    'International Reputation', 'Strength',
                   'Name', 'Nationality', 'Potential',
                   'Preferred Foot', 'Weak Foot', 'Work Rate', 'Body Type','Skill Moves',
                   'GKDiving','GKHandling','GKKicking','GKPositioning','Agility','Composure',
                   'SlidingTackle','Volleys','Dribbling','Curve','Acceleration','SprintSpeed',
                   'Reactions','Balance','ShotPower','Stamina','LongShots',
                   'Aggression','Vision','Penalties'], inplace=True)      

df_pos = data.copy()

X = df_pos.drop(columns=['Best Position'])
X = pd.get_dummies(X)
y = df_pos['Best Position']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33, random_state=42)

logmodel = LogisticRegression()
logmodel.fit(X_train, y_train)

gbclassifier = GradientBoostingClassifier()
gbclassifier.fit(X_train, y_train)