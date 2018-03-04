import React ,{ Component } from 'react';
import Comment from './comment.jsx';
class CommentList extends Component{
	static defaultProps ={
		comments:[]
	}
	
	handleDeleteComment(index){
		if (this.props.onDeleteComment) {
      		this.props.onDeleteComment(index)
    	}
	}
	
	render(){
		
		return (
			<div>	
        		 {
        		 	this.props.comments.map((comment, i) => <Comment onDeleteComment ={ this.handleDeleteComment.bind(this) } comment={comment} key={i} index ={ i } />)
        		 }
      		</div>
		)
	}
}

export default CommentList;