/* 
    Client side javascript, using React.js. Builds components on webpage
*/

// Holder for the entire page
var WikiBox = React.createClass({

  loadArticlesFromServer: function(){

    $.ajax({
      url: '/allpages',
      dataType: 'json',
      cache: false,
      success: function(articles){
        this.loadUsersFromServer();
        this.setState({articles: articles});
      }.bind(this),
      error: function(xhr, status, err){
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });

  },
  loadUsersFromServer: function(){
    $.ajax({
      url: '/getusers',
      dataType: 'json',
      cache: false,
      success: function(users){
        this.setState({users: users});
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
    return {articles: [], users:[]};
  },

  componentDidMount: function() {
    this.loadArticlesFromServer();
    setInterval(this.loadArticlesFromServer, this.props.pollInterval);
  },

  render: function(){
    return (
      <div className="wiki-box">
        <ArticleBox 
          users={this.state.users}
          articles={this.state.articles}
          onArticleSubmit={this.onArticleSubmit}
          loadUsersFromServer={this.loadUsersFromServer}/>
      </div>
    );
  }
});

// Holder for all the content in the page
var ArticleBox = React.createClass({
  getInitialState: function(){
    return {article: {show: false}, showForm: false};
  },
  onArticleSearch: function(articlename){
    var parentThis = this;
    this.props.articles.forEach(function(article){
        if(article.title.toLowerCase() === articlename.title.toLowerCase()) {
          article.show = true;
          parentThis.setState({article: article});
        }
    });
  },
  handleListClick: function(article){
    article.show = true;
    this.setState({article: article, showForm: false});
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

  handleAdd: function(){
    this.setState({article: {show: false}, showForm: !this.state.showForm});
  },

  handleEdit: function(article){

    this.setState({article: article});
    var parentThis =this;

    $.ajax({
      url: '/editpage/' + article.id,
      dataType: 'json',
      type: 'POST',
      data: article,
      success: function(data){

        console.log("EDITTED!", this.state.article);
        console.log("Data: ", data);

        parentThis.setState({article: data});

      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  render: function(){
    var articleForm = <p></p>;
    if (this.state.showForm){
      articleForm = <ArticleForm onArticleSubmit={this.props.onArticleSubmit} />;
    }

    return (
      <div className="article-box">
        <Navbar onArticleSearch={this.onArticleSearch} handleListClick={this.handleListClick}/>
        <div className="article-box-holder">
        <ArticleList users={this.props.users} articles={this.props.articles} handleListClick={this.handleListClick}/>
        <div className="article-box-content">
          {articleForm}
          <ArticleContent 
            article={this.state.article} 
            handleDelete={this.handleDelete} 
            handleListClick={this.handleListClick} 
            handleEdit={this.handleEdit}
            loadUsersFromServer={this.props.loadUsersFromServer}/>
        </div>
        </div>
        <input className="add-article" type="button" onClick={this.handleAdd} value="+"/>
      </div>
    );
  }

});

// Navigation/header bar on the top of the page. Holds login and search bar
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
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loginFacebook();
  },
  render: function(){
    var loginshow = this.state.loginshow;
    var logoutshow = this.state.logoutshow;
    return (
      <div className="Navbar navbar navbar-default">
        <a className="navbar-brand"> Movie Wiki </a>
        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul style={{float:"right"}} className="nav navbar-nav navbar-right">
            <li><a style={{color:"#148a66"}}>{this.state.user.username}</a></li>
            <li style={{float:"right"}}><a href="/auth/facebook" style={{display:loginshow}}><i className="fa fa-facebook">Login</i></a></li>
            <li><a href="/logout" style={{display:logoutshow}}><i className="fa fa-facebook">Logout</i></a></li>
          </ul>
          <SearchForm onArticleSearch={this.props.onArticleSearch}/>
        </div>
      </div>
      );
  }
});

//Search bar in navbar that allows you to search article names
var SearchForm = React.createClass({

  getInitialState: function() {
    return {text: ''};
  },

  handleTitleChange: function(e) {
    this.setState({title: e.target.value});
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var title = this.state.title;
    if (!title) {
      return;
    }
    console.log(title);
    this.props.onArticleSearch({title:title});
    this.setState({title: ''});
  },

  render: function(){

    return(

      <form className="navbar-form navbar-left" onSubmit={this.handleSubmit}>
        <div className="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="Search Article Title"
          value={this.state.title}
          onChange={this.handleTitleChange} />
        </div>
        <button className="btn btn-md" type="submit">
          <i className="fa fa-search"></i>
        </button>
      </form>

      );
  }

});

//Sidebar with list of all articles and users
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
        <div className="article-list-item" key={index} onClick={parentThis.handleClick.bind(null, article._id)}> {article.title} </div>
      );
    });
    var usersNames = this.props.users.map(function(user, index){
      return (
        <div className="article-list-item" key={index}> {user.username} </div>
      );
    });

    return (
      <div className="article-list">
        <h3><center>Users</center></h3>
        {usersNames}
        <h3><center>Articles</center></h3>
        {articleTitles}
      </div>
    );
  }
});

// Submission for for adding new articles
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
    if (!title || !content) {
      return;
    }

    this.props.onArticleSubmit({title:title, content: content});
    this.setState({title: '', content: ''});
  },

  render: function(){

    return(
      <form className="article-form" onSubmit={this.handleSubmit}>
        <input
          className="small-input"
          type="text"
          placeholder="Article Title"
          value={this.state.title}
          onChange={this.handleTitleChange} />
        <br></br>
        <textarea
          className="large-input"
          type="text"
          placeholder="Article content"
          value={this.state.content}
          onChange={this.handleContentChange}></textarea>
        <br></br>
        <input className="button" type="submit" value="Add" />
      </form>

      );
  }

});

// Holder for the content of your article (shows title and article text)
var ArticleContent = React.createClass({
  getInitialState: function(){
    return {article: this.props.article};
  },

  onChange: function(content){
    this.setState({content: content.target.value});
  },

  handleBlur: function(){
    this.sendEdit();
  },

  render: function(){
    var deleteButton = <p></p>;
    if (this.props.article.show){
      deleteButton =  <input className="button" type="button" id={this.props.article._id} value="Delete" 
          onClick={this.props.handleDelete.bind(null, this.props.article._id)}/>;
    }
    return(
      <div className="article-content">
        <ArticleTitle 
          className="article-title"
          title={this.props.article.title}
          id={this.props.article._id}
          editTitle={this.props.editTitle}
          handleEdit={this.props.handleEdit}
          loadUsersFromServer={this.props.loadUsersFromServer}/>
        <br/> 
        <ArticleText 
          className="article-article"
          content={this.props.article.content}
          id={this.props.article._id}
          edit={this.props.edit}
          handleEdit={this.props.handleEdit}/>
        <p></p>
          {deleteButton}
      </div>
    );
  }
});

var ArticleText = React.createClass({

  getInitialState: function(){
    return {edit: false, content: this.props.content};
  },

  onChange: function(content){
    this.setState({content: content.target.value});
  },

  handleFocus: function(){
    this.setState({edit: true});
  },

  sendEdit: function(){
    var article={content: this.state.content, id: this.props.id};
    this.props.handleEdit(article);
    this.setState({content: this.state.content, edit:false});
  },

  handleBlur: function(){
    this.sendEdit();
  },

  handleKey: function(key){
    if( key.charCode == 13 || key.keyCode == 13 ){
        key.preventDefault();
        var content = this.state.content;
        if( !content ){
            return;
        }
        this.sendEdit();
    }
  },

  render: function(){
    if (this.state.edit){
      return (
          <input className="article-article"
              type='text' 
              placeholder={this.props.content} 
              value={this.state.content}
              onBlur={this.handleBlur}
              onChange={this.onChange}
              onKeyPress={this.handleKey}
              id={this.props.id}/>        
      );
    }
    return (
      <div className="article-article" onClick={this.handleFocus}>{this.props.content} </div>
    )
  }
});

var ArticleTitle = React.createClass({

  getInitialState: function(){
    return {editTitle: false, title: this.props.title};
  },

  onChange: function(title){
    this.setState({title: title.target.value});
  },

  handleFocus: function(){
    this.setState({editTitle: true});
  },

  sendEdit: function(){
    var article={title: this.state.title, id: this.props.id};
    console.log(article);
    this.props.handleEdit(article);
    this.setState({title: this.state.title, editTitle:false});
    this.props.loadUsersFromServer();
  },

  handleBlur: function(){
    this.sendEdit();
  },

  handleKey: function(key){
    if( key.charCode == 13 || key.keyCode == 13 ){
        key.preventDefault();
        var title = this.state.title;
        if( !title ){
            return;
        }
        this.sendEdit();
    }
  },

  render: function(){
    if (this.state.editTitle){
      return (
          <input type='text' 
              className="article-title"
              placeholder={this.props.title} 
              value={this.state.title}
              onBlur={this.handleBlur}
              onChange={this.onChange}
              onKeyPress={this.handleKey}
              id={this.props.id}/>        
      );
    }
    return (
      <h2 className="article-title" onClick={this.handleFocus}>{this.props.title} </h2>
    )
  }
});


ReactDOM.render(
  <WikiBox url="/" pollInterval={2000} />,
  document.getElementById('content')
);