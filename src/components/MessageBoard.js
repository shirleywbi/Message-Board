import React from 'react';
import Message from './Message';
import { connect } from 'react-redux';
import { getMessages, deleteAllMessage } from '../actions/index.js';
import MessageSideBar from './MessageSideBar.js';

class MessageBoard extends React.Component {
    componentDidMount() {
        this.props.getMessages();
    }

    render() {
        const { error, loading, messages } = this.props.messageStore;
        let output = null;
        if (error) {
            output = <div>Error.</div>;
        } else if (messages === [] && loading) {
            output = <div>Loading...</div>;
        } else if (messages !== []) {
            output = messages.map(message => <Message name={ message.name } date={ message.date } text={ message.text } key={ message.key }/>);
        }
        return (
        <div id="msg-block">
            <div className="content">
                <h2 id="msg-board-header" className="header">MESSAGE BOARD</h2>
                <button className='mid-button button' onClick={() => this.props.deleteAllMessage()}>Clear All</button>
                <ul id="msg-list">{ output }</ul>
            </div>
            {!this.props.popupStore.hidden && <MessageSideBar hidden={this.props.popupStore.hidden} name={this.props.popupStore.name} 
            message={this.props.popupStore.message} date={this.props.popupStore.date} key={this.props.popupStore.key} />}
        </div>
        );
    }
}

const mapStateToProps = (state) => {
    return state;
}

export default connect(mapStateToProps, { deleteAllMessage, getMessages })(MessageBoard);