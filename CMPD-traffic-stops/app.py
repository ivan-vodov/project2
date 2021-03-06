# import necessary libraries
#import json
# import numpy as np
# import pandas as pd
from flask import Flask, render_template, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################
app.config[
    "SQLALCHEMY_DATABASE_URI"] = "sqlite:///DataSets/CMPD_traffic_stops_enhanced.sqlite"
db = SQLAlchemy(app)


class trafficStop(db.Model):
    __tablename__ = "traffic_stop_data"
    __table_args__ = {"autoload": True, "autoload_with": db.engine}


# Main page route
@app.route("/")
def main():
    return render_template("/index.html")


# map iframe page route
@app.route('/charlotte-map')
def charlotte_map():
    return render_template('/charlotte-division-map.html')


# API - data for control charts
@app.route("/data", methods=['GET'])
def fetch_data():
    # get API call parameters
    division = request.args.get('division')
    reason = request.args.get('reason')
    result = request.args.get('result')
    year = request.args.get('year')

    # initialize query filter strings as empty strings
    reason_filter_string = ""
    result_filter_string = ""
    year_filter_string = ""
    division_filter_string = ""

    # create SQLAlchemy filter statement substrings
    if (reason):
        reason_filter_string = '.filter(trafficStop.Reason_for_Stop == "' + reason + '")'
    if (result):
        result_filter_string = '.filter(trafficStop.Result_of_Stop == "' + result + '")'
    if (year):
        year_filter_string = '.filter(trafficStop.Year == "' + year + '")'
    if (division):
        division_filter_string = '.filter(trafficStop.CMPD_Division == "' + division + '")'

    # create SQLAlchemy statement strings and execute them using eval()
    division_query_string = 'db.session.query(trafficStop.CMPD_Division, func.count())'
    division_query_string += reason_filter_string + result_filter_string + year_filter_string
    division_query_string += '.group_by(trafficStop.CMPD_Division).all()'
    division_query_results = eval(division_query_string)

    reason_query_string = 'db.session.query(trafficStop.Reason_for_Stop, func.count())'
    reason_query_string += division_filter_string + result_filter_string + year_filter_string
    reason_query_string += '.group_by(trafficStop.Reason_for_Stop).all()'
    reason_query_results = eval(reason_query_string)

    result_query_string = 'db.session.query(trafficStop.Result_of_Stop, func.count())'
    result_query_string += division_filter_string + reason_filter_string + year_filter_string
    result_query_string += '.group_by(trafficStop.Result_of_Stop).all()'
    result_query_results = eval(result_query_string)

    year_query_string = 'db.session.query(trafficStop.Year, func.count())'
    year_query_string += division_filter_string + reason_filter_string + result_filter_string
    year_query_string += '.group_by(trafficStop.Year).all()'
    year_query_results = eval(year_query_string)

    count_query_string = 'db.session.query(func.count(trafficStop.id))'
    count_query_string += division_filter_string + reason_filter_string + result_filter_string + year_filter_string
    count_query_string += '.scalar()'
    count_query_results = eval(count_query_string)

    return (jsonify({
        'count': count_query_results,
        'division_data': division_query_results,
        'reason_data': reason_query_results,
        'result_data': result_query_results,
        'year_data': year_query_results
    }), 201)


# API - data for the chart with user defined fields
@app.route("/data_chart1", methods=['GET'])
def fetch_data_chart1():
    division = request.args.get('division')
    reason = request.args.get('reason')
    result = request.args.get('result')
    year = request.args.get('year')
    param = request.args.get('param')
    param_category = request.args.get('param_category')

    # create SQLAlchemy statement string and execute it using eval()
    query_string = 'db.session.query(trafficStop.' + param + ', trafficStop.' + param_category + ', func.count(trafficStop.Driver_Gender))'
    if (division):
        query_string += '.filter(trafficStop.CMPD_Division == "' + division + '")'
    if (result):
        query_string += '.filter(trafficStop.Result_of_Stop == "' + result + '")'
    if (reason):
        query_string += '.filter(trafficStop.Reason_for_Stop == "' + reason + '")'
    if (year):
        query_string += '.filter(trafficStop.Year == "' + year + '")'

    query_string += '.group_by(trafficStop.' + param + ', trafficStop.' + param_category + ').all()'
    query_result = eval(query_string)
    return (jsonify(query_result), 201)


if __name__ == "__main__":
    app.run(debug=True)
