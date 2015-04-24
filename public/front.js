var GuestBook = React.createClass({
  getInitialState: function () {
    return {
      'socket': socket,
      'messages': []
    };
  },
  render: function () {
    return (
      <div>
        <h1>Guest Book</h1>
        <MessageForm/>
        <div style={{'maxWidth': '270px'}}>
          <hr/>
        </div>
        <MessageList/>
      </div>
    );
  }
});

var MessageList = React.createClass({
  getInitialState: function () {
    return {
      messages: []
    }
  },
  componentDidMount: function () {
    var self = this; // hold what 'this' is.
    socket.on('messages', function (data) {
      self.reflesh(data)
    });
  },
  reflesh: function (data) {
    this.setState({messages: data});
  },
  render: function () {
    if (this.state.messages.length === 0) { return <i>Loading...</i> }

    var leftIndex = this.state.messages.length - 10;
    var rightIndex = this.state.messages.length;

    return (
      <div className="messagelist">
        {this.state.messages.slice(leftIndex, rightIndex)
          .reverse()
          .map(function (element, i) {
            return (
              <Message name={element.name} message={element.message} key={i}/>
            )
          })
        }
      </div>
    )
  }
});

var MessageForm = React.createClass({
  clearFormValues: function () {
    React.findDOMNode(this.refs.name).value = '';
    React.findDOMNode(this.refs.message).value = '';
  },
  handleSubmit: function (e) {
    e.preventDefault();

    var name = React.findDOMNode(this.refs.name).value.trim();
    var message = React.findDOMNode(this.refs.message).value.trim();

    if (!name || !message) { return; }

    this.clearFormValues();
    socket.emit('addMessage', {name: name, message: message})
  },
  render: function () {
    return (
      <form className="messageForm" onSubmit={this.handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input id="name" name="name" type="text" ref="name"/>
        <br/>
        <label htmlFor="message">Message:</label>
        <input id="message" name="message" type="text" ref="message"/>
        <br/>
        <input type="submit" value="leave message"/>
      </form>
    )
  }
});

var Message = React.createClass({
  render: function () {
    return (
      <div className="message">
        <ul>
          <li>Name:  {this.props.name}</li>
          <li>Message: {this.props.message}</li>
        </ul>
      </div>
    );
  }
});

React.render(<GuestBook />,
             document.getElementById('guestbook'),
             function () { console.log('React.js has activated.'); });
