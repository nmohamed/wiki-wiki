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
        console.log("THIS DATA: ", data);

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

  render: function(){
    return (
      <div className="NavBar">
        <h1> Movie Wiki </h1>
        <input type="button" className="login-button" value="Login" />
      </div>
      );
  }

});

var ArticleBox = React.createClass({

  render: function(){
    return (
      <div className="article-box">
        <ArticleList articles={this.props.articles} />
        <ArticleForm onArticleSubmit={this.props.onArticleSubmit} />
      </div>
    );
  }

});

var ArticleList = React.createClass({

  render: function(){
    console.log(this.props);

    var articleTitles = this.props.articles.map(function(article, index){
      return (
        <li key={index}> {article.title} </li>
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
  render: function(){
    <div className="article-content">
      <div className="article-title">
        <h2>{this.props.title}</h2>
      </div>
      <div className="article-article">
        {this.props.content}
      </div>
    </div>
  }
});


ReactDOM.render(
  <WikiBox url="/" pollInterval={5000} />,
  document.getElementById('content')
);