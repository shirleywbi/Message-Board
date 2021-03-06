// Reference: 
// https://redux.js.org/advanced/async-actions#async-action-creators
// https://daveceddia.com/where-fetch-data-redux/

// Constants
export const formConstants = {
	CLEAR_FORM: 'CLEAR_FORM',
	UPDATE_NAME: 'UPDATE_NAME',
	UPDATE_MESSAGE: 'UPDATE_MESSAGE'
};

export const messageConstants = {
	ADD_MESSAGE: 'ADD_MESSAGE',
	EDIT_MESSAGE: 'EDIT_MESSAGE',
	DELETE_MESSAGE: 'DELETE_MESSAGE',
	DELETE_ALL: 'DELETE_ALL',
	TOGGLE_MESSAGE: 'TOGGLE_MESSAGE'
};

export const editConstants = {
	UPDATE_EDITBOX: 'UPDATE_EDITBOX',
	TOGGLE_EDIT: 'TOGGLE_EDIT'
}

export const filterConstants = {
	UPDATE_NAME_FILTER: 'UPDATE_NAME_FILTER',
};

export const fetchConstants = {
	FETCH_MESSAGES_REQUEST: 'FETCH_MESSAGES_REQUEST',
	FETCH_MESSAGES_SUCCESS: 'FETCH_MESSAGES_SUCCESS',
	FETCH_MESSAGES_FAILURE: 'FETCH_MESSAGES_FAILURE'
};

// Form actions
export const clearForm = () => {
	return {
		type: formConstants.CLEAR_FORM
	}
}

export const updateName = (event) => {
	return {
		type: formConstants.UPDATE_NAME,
		payload: event.target.value
	}
}

export const updateMessage = (event) => {
	return {
		type: formConstants.UPDATE_MESSAGE,
		payload: event.target.value
	}
}

// Filter actions
export const updateNameFilter = (event) => {
	return {
		type: filterConstants.UPDATE_NAME_FILTER,
		payload: event.target.value
	}
}

// Message actions
export const addMessage = (msg) => {
	return {
		type: messageConstants.ADD_MESSAGE,
		payload: msg
	}
}

export const updateEditBox = (event) => {
	return {
		type: editConstants.UPDATE_EDITBOX,
		payload: event.target.value
	}
}

export const toggleEdit = (id, msg) => {
	return {
		type: editConstants.TOGGLE_EDIT,
		payload: {id, msg}
	}
}

export const editMessage = (res) => {
	return {
		type: messageConstants.EDIT_MESSAGE,
		payload: res
	}
}

export const clearOne = (id) => {
	return {
		type: messageConstants.DELETE_MESSAGE,
		payload: id
	}
}

export const clearAll = (res) => {
	return {
		type: messageConstants.DELETE_ALL,
		payload: res
	}
}

// Sidebar actions
export const toggleMessage = (name, date, message, id) => {
	return {
		type: messageConstants.TOGGLE_MESSAGE,
		payload: { name, date, message, id }
	}
}

// Server Actions
export function getMessages() {
	return async dispatch => {
		dispatch(fetchMessageRequest());
		return fetch("/messages")
			.then(handleErrors)
			.then(res => res.json())
			.then(res => {
				dispatch(fetchMessageSuccess(res));
				return res;
			})
			.catch(err => dispatch(fetchMessageFailure(err)));
	};
}

export function getMessageByName(name) {
	return async dispatch => {
		return fetch("/messages/"+name)
			.then(handleErrors)
			.then(res => res.json())
			.then(res => {
				dispatch(fetchMessageSuccess(res));
				return res;
			})
			.catch(err => dispatch(fetchMessageFailure(err)));
	};
}

export function postMessage(name, text) {
	return async dispatch => {
		dispatch(fetchMessageRequest());
		let new_name = getName(name);
		let date = getCurrDate();
		let id = getID(date);
		return fetch("/messages/", {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: new_name,
				text: text,
				date: date,
				id: id
			})
		})
			.then(handleErrors)
			.then(res => res.json())
			.then(res => {
				dispatch(addMessage(res));
			})
			.catch(err => dispatch(fetchMessageFailure(err)));
	};
}

export function postEditMessage(name, text, date, id, new_text) {
	return async dispatch => {
		let new_date = getCurrDate();
		let new_entry = new_text === null ? text : new_text;
		return fetch("/messages/"+id, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: name,
				text: new_entry,
				date: new_date,
				id: id
			})
		})
			.then(handleErrors)
			.then(res => res.json())
			.then(res => {
				dispatch(editMessage(res));
			})
			.catch(err => dispatch(fetchMessageFailure(err)));
	};
}

export function deleteMessage(id) {
	return async dispatch => {
		dispatch(fetchMessageRequest());
		return fetch("/messages/"+id, {
			method: 'delete',
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(handleErrors)
			.then(res => res.json())
			.then(res => {
				dispatch(clearOne(res));
			})
			.catch(err => dispatch(fetchMessageFailure(err)));
	};
}

export function deleteMessages() {
	return async dispatch => {
		dispatch(fetchMessageRequest());
		return fetch("/messages/", {
			method: 'delete'
		})
			.then(handleErrors)
			.then(res => res.json())
			.then((res) => {
				dispatch(clearAll(res));
			})
			.catch(err => dispatch(fetchMessageFailure(err)));
	};
}

// To handle HTTP errors
const handleErrors = (response) => {
	if (!response.ok) {
		throw Error(response.statusText);
	}
	return response;
}

export const fetchMessageRequest = () => {
	return {
		type: fetchConstants.FETCH_MESSAGES_REQUEST
	}
}

export const fetchMessageSuccess = (messages) => {
	return {
		type: fetchConstants.FETCH_MESSAGES_SUCCESS,
		payload: { messages }
	}
}

export const fetchMessageFailure = (err) => {
	return {
		type: fetchConstants.FETCH_MESSAGES_FAILURE,
		error: { err }
	}
}

function getName(name) {
	return name === "" ? "Anonymous" : name;
}

function getCurrDate() {
    const date = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const hours = new Date().getHours();
    const min = new Date().getMinutes();
    const sec = new Date().getSeconds();
    return month + '/' + date + '/' + year + ' ' + hours + ':' + min + ':' + sec;
}

function getID(date) {
	return date.replace(/[^a-zA-Z0-9]/gi,'');
}