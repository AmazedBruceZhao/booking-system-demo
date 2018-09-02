import React from 'react';
import {Label, Popup, Header, Button, Grid } from 'semantic-ui-react'

import MeetingDetail from "./meetingDetail";

const MeetingList = (props) => {
    if(props.data.length === 0){
        return null
    }

    const content = props.data.map((meeting) => {
        return (
            <MeetingDetail data={meeting} key={meeting.id.Id}/>
        )
    })

    return <Popup wide hoverable flowing
                  trigger={
                      <Label size='mini'>{props.data.length} Meetings</Label>
                  }
            >
            <Grid centered divided columns={props.data.length}>{content}</Grid>
            </Popup>
}


export default MeetingList