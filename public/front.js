var GuestBook = React.createClass({
  getInitialState: function () {
    return {
      'socket': socket,
      'messages': []
    };
  },
  render: function () {
    return (
      <div className="container">
        <h1>Guest Book</h1>
        <div className="col-sm-12">
          <MessageForm/>
        </div>
        <div>
          <MessageList/>
        </div>
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
      <div className="messagelist col-sm-6">
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
      <div className="panel panel-default col-sm-6">
        <div className="panel-body">
          <form className="messageForm" onSubmit={this.handleSubmit}>
            <div className="form-group col-sm-8">
              <label className="col-sm-2 control-label" htmlFor="name">Name</label>
              <input className="form-control" id="name" name="name" type="text" ref="name"/>
            </div>
            <div className="form-group col-sm-8">
              <label className="col-sm-2 control-label" htmlFor="message">Message</label>
              <input className="form-control" id="message" name="message" type="text" ref="message"/>
            </div>
            <div className="form-group col-sm-8">
              <input className="btn btn-primary" type="submit" value="leave message"/>
            </div>
          </form>
        </div>
      </div>
    )
  }
});

var Message = React.createClass({
  render: function () {
    return (
      <div className="message">
        <p>{this.props.name} : {this.props.message}</p>
      </div>
    );
  }
});

React.render(<GuestBook />,
             document.getElementById('guestbook'),
             function () { console.log('React.js has activated.'); });
