import React, { Component } from 'react';
import Header from 'components/Header';
import ListPanel from 'components/ListPanel';
import Footer from 'components/Footer';

class App extends Component {
    render() {
        return <div>
            <Header></Header>
            <ListPanel></ListPanel>
            <Footer/>
        </div>
    }
}

export default App;