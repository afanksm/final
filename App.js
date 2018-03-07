import React from 'react';
import { ListView, StyleSheet, View } from 'react-native';
import { Body, Title, Right, Container, Header, Content, Button, Icon, List, ListItem, Text } from 'native-base';

export default class App extends React.Component {

  constructor() {
  super();
  this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  this.state = {
    movies: []
    }
  }

  getMovies() {
    // Airtable API endpoint, replace with your own
    let airtableUrl = "https://api.airtable.com/v0/app7YyXtWaDTLrAoO/Movies";

    // Needed for Airtable authorization, replace with your own API key
    let requestOptions = {
      headers: new Headers({
        'Authorization': 'Bearer keyv8406PkLURmwL9'
      })
    };

    // Form the request
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(response => response.json()).then(json => {
      this.setState({
        movies: json.records
      });
    });
  }


  componentDidMount() {
    this.getMovies(); // refresh the list when we're done
  }

  // The UI for what appears when you swipe right
  renderSwipeRight(data, secId, rowId, rowMap) {
    return (
      <Button full success onPress={() => this.upvoteMovie(data, secId, rowId, rowMap)}>
        <Icon active name="thumbs-up" />
      </Button>
    )
  }

  renderSwipeLeft(data, secId, rowId, rowMap) {
    return (
      <Button full danger onPress={() => this.downVoteMovie(data, secId, rowId, rowMap)}>
        <Icon active name="thumbs-down" />
      </Button>
    )
  }

  upvoteMovie(data, secId, rowId, rowMap) {
    // Slide the row back into place
    rowMap[`${secId}${rowId}`].props.closeRow();

    // Airtable API endpoint
    let airtableUrl = "https://api.airtable.com/v0/app7YyXtWaDTLrAoO/Movies/" + data.id;

console.log(data.fields.votes+1)

    // Needed for Airtable authorization
    let requestOptions = {
      method: 'PATCH',
      headers: new Headers({
        'Authorization': 'Bearer keyv8406PkLURmwL9', // replace with your own API key
        'Content-type': 'application/json'
      }),
      body: JSON.stringify({
        fields: {
          votes: data.fields.votes + 1
        }
      })
    };

    // Form the request
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(response => response.json()).then(json => {
      this.getMovies(); // refresh the list when we're done
    });
  }

  downvoteMovie(data, secId, rowId, rowMap) {
    // Slide the row back into place
    rowMap[`${secId}${rowId}`].props.closeRow();

    // Airtable API endpoint
    let airtableUrl = "https://api.airtable.com/v0/app7YyXtWaDTLrAoO/Movies/" + data.id;

    // Needed for Airtable authorization
    let requestOptions = {
      method: 'PATCH',
      headers: new Headers({
        'Authorization': 'Bearer keyv8406PkLURmwL9', // replace with your own API key
        'Content-type': 'application/json'
      }),
      body: JSON.stringify({
        fields: {
          votes: data.fields.votes - 1
        }
      })
    };

    // Form the request
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(response => response.json()).then(json => {
      this.getMovies(); // refresh the list when we're done
    });
  }

  // The UI for what appears when you swipe left
  renderSwipeLeft(data, secId, rowId, rowMap) {
    return (
      <Button full danger onPress={() => this.downvoteMovie(data, secId, rowId, rowMap)}>
        <Icon active name="thumbs-down" />
      </Button>
    )
  }


  renderRow(data) {
      return (
        <ListItem style={{ paddingLeft: 20, paddingRight: 20 }}>
          <Body>
            <Text>{data.fields.title}</Text>
          </Body>
          <Right>
            <Text note>{data.fields.votes} votes</Text>
          </Right>
        </ListItem>
      )
    }

  render() {
    let rows = this.ds.cloneWithRows(this.state.movies);
  console.log(this.state.movies)
    return (

      <Container>
      <Header>
        <Body>
          <Title>Movies to Watch</Title>
        </Body>

      </Header>
      <Content>
        <List
          dataSource={rows}
          renderRow={(data) => this.renderRow(data)}
          renderLeftHiddenRow={(data, secId, rowId, rowMap) => this.renderSwipeRight(data, secId, rowId, rowMap)}
          renderRightHiddenRow={(data, secId, rowId, rowMap) => this.renderSwipeLeft(data, secId, rowId, rowMap)}
          leftOpenValue={75}
          rightOpenValue={-75}
        />
      </Content>
    </Container>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
