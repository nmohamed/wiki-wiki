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
  componentDidMount: function() {
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '1579558155702875',
        cookie     : true,  // enable cookies to allow the server to access
                          // the session
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.1' // use version 2.1
      });
      // Now that we've initialized the JavaScript SDK, we call
      // FB.getLoginStatus().  This function gets the state of the
      // person visiting this page and can return one of three states to
      // the callback you provide.  They can be:
      //
      // 1. Logged into your app ('connected')
      // 2. Logged into Facebook, but not your app ('not_authorized')
      // 3. Not logged into Facebook and can't tell if they are logged into
      //    your app or not.
      //
      // These three cases are handled in the callback function.
      FB.getLoginStatus(function(response) {
        this.statusChangeCallback(response);
      }.bind(this));
    }.bind(this);
    // Load the SDK asynchronously
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  },
  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  testAPI: function() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      // document.getElementById('status').innerHTML =
      //   'Thanks for logging in, ' + response.name + '!';
      username = response;
    });
  },
  statusChangeCallback: function(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      console.log("here")
      this.testAPI();
      document.getElementById('statuslogout').style.display = "block";
      document.getElementById('status').style.display = "none";
    } else if (response.status === 'not_authorized') {
      console.log("not auth")
      // The person is logged into Facebook, but not your app.
      // document.getElementById('status').innerHTML = 'Please log ' +
      //   'into this app.';
    } else {
      console.log("unknown")
      document.getElementById('statuslogout').style.display = "none";
      document.getElementById('status').style.display = "block";
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      // document.getElementById('status').innerHTML = 'Please log ' +
      // 'into Facebook.';
    }
  },
  // This is called with the results from from FB.getLoginStatus().
  statusChangeCallbackOnClick: function(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      console.log("here")
      this.testAPI();
      document.getElementById('statuslogout').style.display = "none";
      document.getElementById('status').style.display = "block";
    } else if (response.status === 'not_authorized') {
      console.log("not auth")
      // The person is logged into Facebook, but not your app.
      // document.getElementById('status').innerHTML = 'Please log ' +
      //   'into this app.';
    } else {
      console.log("unknown")
      document.getElementById('statuslogout').style.display = "block";
      document.getElementById('status').style.display = "none";
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      // document.getElementById('status').innerHTML = 'Please log ' +
      // 'into Facebook.';
    }
  },
  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  checkLoginState: function() {
    FB.getLoginStatus(function(response) {
      this.statusChangeCallbackOnClick(response);
    }.bind(this));
  },
  handleClick: function() {
    FB.login(this.checkLoginState());
  },
  handleClickLogout: function() {
    FB.logout(this.checkLoginState());
  },
  render: function(){
    return (
      <div className="NavBar">
        <h1> Movie Wiki </h1>
        <a href="#" id="status" onClick={this.handleClick}>Login</a>
        <a href="#" id="statuslogout" onClick={this.handleClickLogout}>Logout</a>
      </div>
      );
  }
});

var ArticleBox = React.createClass({

  render: function(){
    return (
      <div className="article-box">
        <ArticleList articles={this.props.articles}/>
        <ArticleForm onArticleSubmit={this.props.onArticleSubmit}/>
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


ReactDOM.render(
  <WikiBox url="/" pollInterval={5000} />,
  document.getElementById('content')
);