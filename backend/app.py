import random
import json

from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from enum import Enum
from typing import List
from datetime import datetime

app = FastAPI()

# Set up CORS middleware options
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Your existing code for the Arrow Enum, daily_combination, and routes follows...


with open('data/stratagems.json') as f:
    stratagem_data = json.load(f)

class Arrow(str, Enum):
    up = "up"
    down = "down"
    left = "left"
    right = "right"

class Combination(BaseModel):
    user_combination: List[str]

def get_random_daily_stratagem(current_date = None):
    global stratagem_data
    current_date = current_date or datetime.now().date()
    random.seed(str(current_date))
    random_value = random.randint(0, len(stratagem_data)-1)  # This will generate a random float between 0.0 and 1.0
    keys = list(stratagem_data)

    return {"name": keys[random_value], "value": stratagem_data[keys[random_value]]}

@app.post("/check")
async def check_arrows(combination: Combination):
    if not combination.user_combination:
        raise HTTPException(status_code=400, detail="No arrows provided")
    daily = get_random_daily_stratagem()
    daily_combination = daily['value']['combination']

    results = []
    if combination.user_combination == daily_combination:
        success = True
    else:
        success = False

    for i, arrow in enumerate(combination.user_combination):
        if i < len(daily_combination):
            if arrow == daily_combination[i]:
                results.append("correct")
            elif arrow in daily_combination:
                results.append("present")
            else:
                results.append("absent")
        else:
            results.append("absent")

    return {"results": results, "success": success}

@app.get("/get-daily-combination")
async def get_daily():
    return get_random_daily_stratagem()