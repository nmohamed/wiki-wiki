var username;
var auth_id;

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
        <ArticleBox 
          articles={this.state.articles}
          onArticleSubmit={this.onArticleSubmit}/>
      </div>
    );
  }
});


var ArticleBox = React.createClass({
  getInitialState: function(){
    return {article: {show: false}};
  },
  onArticleSearch: function(articlename){
    var parentThis = this;
    // var queryResult=[];
    // this.state.articles.forEach(function(person){
    //     if(person.title.toLowerCase().indexOf(articlename.title)!=-1)
    //     queryResult.push(person);
    // });
    this.props.articles.forEach(function(article){
        if(article.title.toLowerCase() === articlename.title.toLowerCase()) {
          article.show = true;
          parentThis.setState({article: article});
        }
    });
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
        <Navbar onArticleSearch={this.onArticleSearch} handleListClick={this.handleListClick}/>
        <ArticleList articles={this.props.articles} handleListClick={this.handleListClick}/>
        <ArticleForm onArticleSubmit={this.props.onArticleSubmit} />
        <ArticleContent article={this.state.article} 
          handleDelete={this.handleDelete} handleListClick={this.handleListClick} />
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
      <div className="Navbar navbar navbar-default">
        <a className="navbar-brand"> Movie Wiki </a>
        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul className="nav navbar-nav navbar-right">
            <li><a style={{color:"#148a66"}}>{this.state.user.username}</a></li>
            <li><a href="/auth/facebook" style={{display:loginshow}}>Login with Facebook</a></li>
            <li><a href="/logout" style={{display:logoutshow}}> Logout</a></li>
          </ul>
          <SearchForm onArticleSearch={this.props.onArticleSearch}/>
        </div>
      </div>
      );
  }
});

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
          placeholder="Article Title"
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