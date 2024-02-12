export class DataStore {
  constructor(initialState) {
    this.subscriptions = [];
    this.state = initialState;
  }

  addListener(subscription) {
    this.subscriptions.push(subscription);
  }

  notifySubscribersOfStateChange() {
    for (const subscription of this.subscriptions) {
      subscription(this.state);
    }
  }

  setState(newState) {
    this.state = newState;
    this.notifySubscribersOfStateChange();
  }
}

const countStore = new DataStore(0);
countStore.addListener((newCount) => {
  console.log("Count was updated to", newCount);
});
countStore.setState(2);
