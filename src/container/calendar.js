import React, { Component } from 'react';
import Header from "../component/header";
import soap from '../lib/soap'
import xml2js from 'xml2js'
import Day from "./day";

class Calendar extends Component {
    constructor(props){
        super(props)
        this.state = {
            meetings : []
        }
    }

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
                <Header/>
                {test}
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
