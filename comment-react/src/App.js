import React, {
	Component
} from 'react';
import CommentInput from './CommentInput.jsx';
import CommentList from './commentList.jsx';

class App extends Component {
	constructor() {
		super()
		this.state = {
			comments: []
		}
	}

	handleSubmitComment(comment) {
		this.state.comments.push(comment)
		const comments = this.state.comments
		this.setState({
			comments: this.state.comments
		})
		this._saveComments(comments)
		console.log(comment)
	}

	handleDeleteComment(index) {
		console.log(index);
		const comments = this.state.comments;
		comments.splice(index, 1);
		this.setState({
			comments: comments
		})
		this._saveComments(comments)
	}


	_loadComments() {
		let comments = localStorage.getItem('comments')
		if (comments) {
			comments = JSON.parse(comments)
			this.setState({
				comments
			})
		}

	}
	_saveComments(comment) {
		localStorage.setItem('comments', JSON.stringify(comment))
	}

	componentWillMount() {
		this._loadComments()
	}

	render() {

		return (
			<div>
				<CommentInput onSubmit = { this.handleSubmitComment.bind(this) } />
				<CommentList onDeleteComment ={ this.handleDeleteComment.bind(this) } comments = { this.state.comments }/>
			</div>
		)
	}
}

export default App;