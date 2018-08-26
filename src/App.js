import React, { Component } from 'react';
import Calendar from "./container/calendar";
import { Header, Container } from 'semantic-ui-react'


class App extends Component {
  render() {
    return (
      <div>
        <Header>
          <h1>Booking System</h1>
        </Header>
        <Container>
          <Calendar/>
        </Container>
      </div>
    );
  }
}

export default App;
