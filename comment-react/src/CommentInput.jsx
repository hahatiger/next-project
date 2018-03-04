import React ,{ Component } from 'react';

class CommentInput extends Component{
	constructor(){
		super();
		this.state = {
			username:'',
			content:''
		}
	}

	

	handleUserNameBlur(e){
		this._saveUserName(e.target.value)
	}

	handleUserNameChange(e){
		this.setState({
			username:e.target.value
		})
	}


	handleContentChange(e){
		this.setState({
			content:e.target.value
		})

	}



	handleSubmit(e){
		if(this.props.onSubmit){
			// const {username,content} = this.state;

			this.props.onSubmit({
				username:this.state.username,
				content:this.state.content,
				createdTime:+Date.now()
			})
		}
		this.textarea.value=''
		this.setState({ content: '' })
	}	
	
	componentWillMount(){
		this._loaderUserName()
	}
	componentDidMount(){
		this.textarea.focus()
	}
	_saveUserName(username){
		localStorage.setItem('username',username)
	}
	
	_loaderUserName(){
		const username = localStorage.getItem('username')
		if(username){
			this.setState({
				username:username
			})
		}
	}
	render(){
		return (
			<div className='comment-input'>
		        <div className='comment-field'>
		          <span className='comment-field-name'>用户名：</span>
		          <div className='comment-field-input'>
		            <input value = { this.state.username } onBlur={ this.handleUserNameBlur.bind(this) } onChange = { this.handleUserNameChange.bind(this) }/>
		          </div>
		        </div>
		        <div className='comment-field'>
		          <span className='comment-field-name'>评论内容：</span>
		          <div className='comment-field-input'>
		            <textarea ref={ (textarea)=>{this.textarea=textarea} } value={ this.state.value } onChange = { this.handleContentChange.bind(this) } />
		          </div>
		        </div>
		        <div className='comment-field-button'>
		          <button onClick = { this.handleSubmit.bind(this) }>
		            发布
		          </button>
		        </div>
	      </div>
		)
	}
}

export default CommentInput;