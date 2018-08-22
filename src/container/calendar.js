import React, { Component } from 'react';
import dateFns from 'date-fns'
import xml2js from 'xml2js'
import soap from '../lib/soap'

class Calendar extends Component {
    constructor(props){
        super(props)
        this.state = {
            meetings : [],
            currentMonth: new Date(),
            selectedDate: new Date()
        }
    }
    renderHeader() {
        const dateFormat = "MMMM YYYY";
        return (
            <div className="header row flex-middle">
                <div className="col col-start">
                    <div className="icon" onClick={this.prevMonth}>
                        chevron_left
                    </div>
                </div>
                <div className="col col-center">
                    <span>
                      {dateFns.format(this.state.currentMonth, dateFormat)}
                    </span>
                </div>
                <div className="col col-end" onClick={this.nextMonth}>
                    <div className="icon">chevron_right</div>
                </div>
            </div>
        );
    }

    renderDays() {
        const dateFormat = "dddd";
        const days = [];
        let startDate = dateFns.startOfWeek(this.state.currentMonth);
        for (let i = 0; i < 7; i++) {
            days.push(
                <div className="col col-center" key={i}>
                    {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
                </div>
            );
        }
        return <div className="days row">{days}</div>;
    }

    renderCells() {
        const {currentMonth, selectedDate} = this.state;
        const monthStart = dateFns.startOfMonth(currentMonth);
        const monthEnd = dateFns.endOfMonth(monthStart);
        const startDate = dateFns.startOfWeek(monthStart);
        const endDate = dateFns.endOfWeek(monthEnd);

        const dateFormat = "D";
        const rows = [];

        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = dateFns.format(day, dateFormat);
                const cloneDay = day;
                days.push(
                    <div
                        className={`col cell ${
                            !dateFns.isSameMonth(day, monthStart)
                                ? "disabled"
                                : dateFns.isSameDay(day, selectedDate) ? "selected" : ""
                            }`}
                        key={day}
                        onClick={() => this.onDateClick(dateFns.parse(cloneDay))}
                    >
                        <span className="number">{formattedDate}</span>
                        <span className="bg">{formattedDate}</span>
                    </div>
                );
                day = dateFns.addDays(day, 1);
            }
            rows.push(
                <div className="row" key={day}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div className="body">{rows}</div>;
    }

    onDateClick = day => {
        this.setState({
            selectedDate: day
        });
    };

    nextMonth = () => {
        this.setState({
            currentMonth: dateFns.addMonths(this.state.currentMonth, 1)
        });
    };

    prevMonth = () => {
        this.setState({
            currentMonth: dateFns.subMonths(this.state.currentMonth, 1)
        });
    };

    render(){
        console.log(this.state.meetings)
        const test = this.state.meetings.map((meeting, key) => {

            return (
                <div key={key}>
                    <Day data={meeting} />
                </div>
            )

        })
        return (
            <div>
                {this.renderHeader()}
                {this.renderDays()}
                {this.renderCells()}
            </div>
        )
    }

    componentDidMount(){
        soap('<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"\n' +
            '\txmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n' +
            '\txmlns:m="http://schemas.microsoft.com/exchange/services/2006/messages"\n' +
            '\txmlns:t="http://schemas.microsoft.com/exchange/services/2006/types">\n' +
            '\t<soap:Body>\n' +
            ' <m:FindItem Traversal="Shallow">\n' +
            '      <m:ItemShape>\n' +
            '        <t:BaseShape>Default</t:BaseShape>\n' +
            '      </m:ItemShape>\n' +
            '      <m:CalendarView MaxEntriesReturned="100" StartDate="2017-09-09T12:00:00Z" EndDate="2018-09-13T12:00:00Z" />\n' +
            '      <m:ParentFolderIds>\n' +
            '        <t:DistinguishedFolderId Id="calendar"/>\n' +
            '      </m:ParentFolderIds>\n' +
            '    </m:FindItem>\n' +
            '</soap:Body>\n' +
            '</soap:Envelope>').then(res => {
                return res.text()
            }).then(data => {
                let that = this
                xml2js.parseString(data, function (err, result) {
                    if (!err){
                        //console.log(result);
                        let res = result['s:Envelope']["s:Body"][0]["m:FindItemResponse"][0]["m:ResponseMessages"][0]["m:FindItemResponseMessage"][0]
                        let responseClass = res["$"]["ResponseClass"]
                        let responseCode = res["m:ResponseCode"]
                        if (responseClass === 'Success'){
                            let meetings = res["m:RootFolder"][0]["t:Items"][0]["t:CalendarItem"].map((item) => {
                                let start = item["t:Start"][0]
                                let end = item["t:End"][0]
                                let location = item["t:Location"] ? item["t:Location"][0] : ''
                                let subject = item["t:Subject"][0]
                                let organizers = item["t:Organizer"].map((item) => {
                                    return item["t:Mailbox"][0]["t:Name"]
                                })
                                return {
                                    start: start,
                                    end: end,
                                    location: location,
                                    subject: subject,
                                    organizers: organizers
                                }
                            })
                            //console.log(meetings)
                            that.setState({
                                meetings: meetings
                            })
                        }
                    }
                });
            })
    }
}

export default Calendar
