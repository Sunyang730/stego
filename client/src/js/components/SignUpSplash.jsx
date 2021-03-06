var React = require('react');
var auth = require('../stores/auth.js');
var SignUpSplash = React.createClass({

  // getInitialState: function(){
  //   return {
  //     showComponent: false
  //   };
  // },

  // This function logs in to Github, and triggers a series of AJAX calls that extract the user's info, repos, and commits
  getProviderCode: function(service, loginServer) {
    this.props.auth.getCode(service, loginServer);
  },

  pairAccounts: function() {
    this.props.auth.sendToServer('pairing');
  },

  render: function() {
    
    return (
      <div className='sign-in-container' style={this.props.css}>
        <img className="logo" src="./images/stego-logo.png"/>
        <div className='button-container'>
          <a className="button" onClick={this.getProviderCode.bind(null, 'github')}><img className="icons" src="./images/icons/githubicon.png"/>Authorize with GitHub</a>
          <div className="or">
            <p>&</p>
          </div>
          <a className="button" onClick={this.getProviderCode.bind(null, 'jawbone')}><img className="icons" src="./images/icons/jawboneicon.png"/>Authorize with Jawbone</a>
          <div className="or"></div>
          <a disabled="true" className="button" onClick={this.pairAccounts}>Login</a>
        </div>
      </div>
    )
  }
});

module.exports = SignUpSplash;
