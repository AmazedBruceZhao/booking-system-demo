import React, { Component } from 'react';
import dateFns from 'date-fns'
import xml2js from 'xml2js'
import soap from '../lib/soap'
import { Grid, Segment, Label, Button } from 'semantic-ui-react'
import MeetingDetails from '../component/meetingDetails'

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
            <Grid.Row columns={3}>
                <Grid.Column textAlign='left'>
                    <div className="icon" onClick={this.prevMonth}>
                        chevron_left
                    </div>
                </Grid.Column>
                <Grid.Column textAlign='center'>
                    <span>
                      {dateFns.format(this.state.currentMonth, dateFormat)}
                    </span>
                </Grid.Column >
                <Grid.Column textAlign='right' onClick={this.nextMonth} >
                    <div>chevron_right</div>
                </Grid.Column>
            </Grid.Row>
        );
    }

    renderDays() {
        const dateFormat = "dddd";
        const days = [];
        let startDate = dateFns.startOfWeek(this.state.currentMonth);
        for (let i = 0; i < 7; i++) {
            days.push(
                <Grid.Column key={i}>
                    {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
                </Grid.Column>
            );
        }
        return <Grid.Row columns={7} >{days}</Grid.Row>;
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
                const currentDate = dateFns.format(day, 'YYYYMMDD')
                days.push(
                    <Grid.Column key={day}>
                        <Segment style={{height: 100}}
                            disabled={!dateFns.isSameMonth(day, monthStart)}
                            color={dateFns.isSameDay(day, selectedDate) ? 'blue' : 'grey'}
                            onClick={() => this.onDateClick(dateFns.parse(cloneDay))}
                        ><Label as='a' color='blue' ribbon>
                            {formattedDate}
                        </Label>
                            <Button icon='add' size='mini' floated='right'/>
                            <MeetingDetails data={currentDate in this.state.meetings ? this.state.meetings[currentDate] : []}/>
                        </Segment>
                    </Grid.Column>
                );
                day = dateFns.addDays(day, 1);
            }
            rows.push(
                <Grid.Row columns={7} key={day}>
                    {days}
                </Grid.Row>
            );
            days = [];
        }
        return <Grid>{rows}</Grid>;
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

        return (
            <Grid>
                {this.renderHeader()}
                {this.renderDays()}
                {this.renderCells()}
            </Grid>
        )
    }

    updateMeetings(){
        const {currentMonth} = this.state;
        const monthStart = dateFns.startOfMonth(currentMonth);
        const monthEnd = dateFns.endOfMonth(monthStart);
        const startDate = dateFns.startOfWeek(monthStart);
        const endDate = dateFns.endOfWeek(monthEnd);
        const start = dateFns.format(dateFns.subHours(startDate, 8), 'YYYY-MM-DD[T]HH:MM:ss[Z]');
        const end = dateFns.format(dateFns.subHours(endDate, 8), 'YYYY-MM-DD[T]HH:MM:ss[Z]');

        const query = '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"\n' +
            '\txmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n' +
            '\txmlns:m="http://schemas.microsoft.com/exchange/services/2006/messages"\n' +
            '\txmlns:t="http://schemas.microsoft.com/exchange/services/2006/types">\n' +
            '\t<soap:Body>\n' +
            ' <m:FindItem Traversal="Shallow">\n' +
            '      <m:ItemShape>\n' +
            '        <t:BaseShape>Default</t:BaseShape>\n' +
            '      </m:ItemShape>\n' +
            `      <m:CalendarView MaxEntriesReturned="100" StartDate="${start}" EndDate="${end}" />\n` +
            '      <m:ParentFolderIds>\n' +
            '        <t:DistinguishedFolderId Id="calendar"/>\n' +
            '      </m:ParentFolderIds>\n' +
            '    </m:FindItem>\n' +
            '</soap:Body>\n' +
            '</soap:Envelope>';

        soap(query).then(res => {
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
                        const meetings = []
                        if(res["m:RootFolder"][0]["t:Items"][0]["t:CalendarItem"]){
                            res["m:RootFolder"][0]["t:Items"][0]["t:CalendarItem"].map((item) => {
                                let start = dateFns.format(dateFns.parse(item["t:Start"][0]), 'HH:MM:ss')
                                let end = dateFns.format(dateFns.parse(item["t:End"][0]), 'HH:MM:ss')
                                let location = item["t:Location"] ? item["t:Location"][0] : ''
                                let subject = item["t:Subject"][0]
                                let organizers = item["t:Organizer"].map((item) => {
                                    return item["t:Mailbox"][0]["t:Name"]
                                })
                                const object = {
                                    start: start,
                                    end: end,
                                    location: location,
                                    subject: subject,
                                    organizers: organizers
                                }
                                let date = dateFns.format(dateFns.parse(item["t:Start"][0]), 'YYYYMMDD')
                                if(date in meetings){
                                    meetings[date].push(
                                        object
                                    )
                                }else{
                                    meetings[date] = [object]
                                }

                            })
                        }
                        //console.log(meetings)
                        that.setState({
                            meetings: meetings
                        })
                    }
                }
            });
        })
    }

    componentDidMount(){
        this.updateMeetings();
        this.intervalId = setInterval(() => {
            this.updateMeetings();
        }, 2000);
    }

    componentWillUnMount(){
        clearInterval(this.intervalId)
    }


}

export default Calendar
