import React from 'react';
import Message from './Message';
import { connect } from 'react-redux';
import { getMessages, getMessageByName, deleteMessages, updateNameFilter } from '../actions/index.js';
import MessageSideBar from './MessageSideBar.js';

class MessageBoard extends React.Component {
    componentDidMount() {
        this.props.getMessages();
    }

    render() {
        const { error, loading, messages } = this.props.messageStore;
        let output = null;
        if (error) {
            output = <div>Error</div>;
        } else if (messages === [] && loading) {
            output = <div>Loading...</div>;
        } else if (messages !== []) {
            output = messages.map(message => 
            <Message name={ message.name } date={ message.date } text={ message.text } id={ message.id } key={ message.id }/>);
        }
        return (
        <div id="msg-block">
            <div className="content">
                <h2 id="msg-board-header" className="header">MESSAGE BOARD</h2>
                <button className='mid-button button' onClick={() => this.props.deleteMessages()}>Clear All</button>
                <div id="filter-box">
                    <label className="form-label">
                        Name: 
                        <input id="name-filter" type="text" className="form-item" value={this.props.nameFilter} 
                        onChange={(e) => this.props.updateNameFilter(e)}/>
                    </label>
                    <button className='mid-button button' 
                        onClick={() => {this.props.getMessageByName(this.props.nameFilter)}}>
                        Filter
                    </button>
                </div>

                <ul id="msg-list">{ output }</ul>
            </div>
            {!this.props.popupStore.hidden && <MessageSideBar hidden={this.props.popupStore.hidden} name={this.props.popupStore.name} 
            message={this.props.popupStore.message} date={this.props.popupStore.date} id={this.props.popupStore.id}  key={this.props.popupStore.id}/>}
        </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        messageStore: state.messageStore,
        popupStore: state.popupStore,
        nameFilter: state.filterStore.name
    };
}

export default connect(mapStateToProps, { deleteMessages, getMessages, getMessageByName, updateNameFilter })(MessageBoard);