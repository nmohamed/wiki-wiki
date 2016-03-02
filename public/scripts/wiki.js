var username;
var auth_id;
$.getScript("scripts/auth.js", function(){
  console.log("here");
});

var WikiBox = React.createClass({

  loadArticlesFromServer: function(){

    $.ajax({
      url: '/allpages',
      dataType: 'json',
      cache: false,
      success: function(articles){
        this.setState({articles: articles});
      }.bind(this),
      error: function(xhr, status, err){
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });

  },

  onArticleSubmit: function(article){

    $.ajax({
      url: '/submitpage',
      dataType: 'json',
      type: 'POST',
      data: article,
      success: function(data) {
        var articles = this.state.articles;
        articles.push(data);

        this.setState({articles: articles});

      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });

  },

  getInitialState: function() {
    return {articles: []};
  },

  componentDidMount: function() {
    this.loadArticlesFromServer();
    setInterval(this.loadArticlesFromServer, this.props.pollInterval);
  },

  render: function(){

    return (
      <div className="wiki-box">
        <Navbar />
        <ArticleBox 
          articles={this.state.articles}
          onArticleSubmit={this.onArticleSubmit}/>
      </div>
    );
  }
});



var Navbar = React.createClass({
  getInitialState: function() {
    return {user: '',loginshow:'',logoutshow:'none'};
  },
  loginFacebook: function(){
    $.ajax({
      url: '/login',
      dataType: 'json',
      type: 'GET',
      success: function(data) {
        this.setState({user: data, loginshow:'none', logoutshow:''});
        console.log(data)
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({user: '',loginshow:'',logoutshow:'none'});
        // console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loginFacebook();
  },
  render: function(){
    var loginshow = this.state.loginshow;
    var logoutshow = this.state.logoutshow;
    // console.log(req.session.passport);
    return (
      <div className="NavBar">
        <h1> Movie Wiki </h1>
        <a href="/auth/facebook" style={{display:loginshow}}>Login with Facebook</a>
        <a href="/logout" style={{display:logoutshow}}> Logout</a>
        <p>{this.state.user.username}</p>
      </div>
      );
        //     <a href="#" id="status" onClick={this.handleClick}>Login</a>
        // <a href="#" id="statuslogout" onClick={this.handleClickLogout}>Logout</a>
  }
});

var ArticleBox = React.createClass({
  getInitialState: function(){
    return {article: {show: false}};
  },
  
  handleListClick: function(article){
    article.show = true;
    this.setState({article: article});
  },

  handleDelete: function(id){
    var parentThis = this;
    $.ajax({
      url: '/deletepage/' + id,
      dataType: 'json',
      type: 'DELETE',
      data: {id: id},
      success: function(data) {
        parentThis.setState({article: {show: false}});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  render: function(){
    return (
      <div className="article-box">
        <ArticleList articles={this.props.articles} handleListClick={this.handleListClick}/>
        <ArticleForm onArticleSubmit={this.props.onArticleSubmit} />
        <ArticleContent article={this.state.article} 
          handleDelete={this.handleDelete} handleListClick={this.handleListClick} />
      </div>
    );
  }

});

var ArticleList = React.createClass({
  handleClick: function(id){
    $.ajax({
      url: '/page/' + id,
      dataType: 'json',
      type: 'GET',
      data: {id: id},
      success: function(data) {
        this.props.handleListClick(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  render: function(){
    var parentThis = this;
    var articleTitles = this.props.articles.map(function(article, index){
      return (
        <li key={index} onClick={parentThis.handleClick.bind(this, article._id)}> {article.title} </li>
      );
    });

    return (
      <div className="article-list">
        <ul>  
          {articleTitles}
        </ul>
      </div>
    );
  }
});


var ArticleForm = React.createClass({

  getInitialState: function() {
    return {text: ''};
  },

  handleTitleChange: function(e) {
    this.setState({title: e.target.value});
  },

  handleContentChange: function(e){
    this.setState({content: e.target.value});
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var title = this.state.title;
    var content = this.state.content;
    console.log(username);
    if (!title || !content) {
      return;
    }

    this.props.onArticleSubmit({title:title, content: content});
    this.setState({title: '', content: ''});
  },

  render: function(){

    return(
      <form className="article-form basic-grey" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Article Title"
          value={this.state.title}
          onChange={this.handleTitleChange} />

        <input
          type="text"
          placeholder="Article content"
          value={this.state.content}
          onChange={this.handleContentChange} />

        <input type="submit" value="Add" />
      </form>

      );
  }

});


var ArticleContent = React.createClass({
  getInitialState: function(){
    return {article: this.props.article};
  },
  render: function(){
    var deleteButton = <p></p>;
    if (this.props.article.show){
      deleteButton =  <input type="button" id={this.props.article._id} value="Delete" 
          onClick={this.props.handleDelete.bind(this, this.props.article._id)}/>;
    }
    return(
      <div className="article-content">
        <div className="article-title">
          <h2>{this.props.article.title}</h2>
        </div>
        <div className="article-article">
          {this.props.article.content}
        </div>
          {deleteButton}
      </div>
    );
  }
});


ReactDOM.render(
  <WikiBox url="/" pollInterval={5000} />,
  document.getElementById('content')
);