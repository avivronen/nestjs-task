describe('my test', () => {
  it('returns true', () => {
    expect(true).toEqual(true);
  });
});

//feature
class FriendsList {
  friends = [];

  addFriend(name) {
    this.friends.push(name);
    this.announceFriendship(name);
  }

  announceFriendship(name) {
    console.log(`${name} is now a friend!`);
  }

  removeFriend(name) {
    const idx = this.friends.indexOf(name);
    if(idx === -1) {
      //console.log('error');
      throw new Error('Friend not found!');
    }
    else {
      this.friends.splice(idx, 1);
    }
  }
}

describe('FriendsList', function() {
  let friendsList;

  beforeEach(() => {
    friendsList = new FriendsList();
  });

  it('should initialized friends list', function() {
    expect(friendsList.friends.length).toEqual(0);
  });

  it('should adds a friend to the list', function() {
    friendsList.addFriend('Aviv');
    expect(friendsList.friends.length).toEqual(1);
  });

  it('should announces friendship', function() {
    friendsList.announceFriendship = jest.fn();
    expect(friendsList.announceFriendship).not.toHaveBeenCalled();
    friendsList.addFriend('Aviv');
    expect(friendsList.announceFriendship).toHaveBeenCalledWith('Aviv');
  });
  
  describe('removeFriend', () => {
    it('should remove a friend from the list', function() {
      friendsList.addFriend('Aviv');
      expect(friendsList.friends[0]).toEqual('Aviv');
      friendsList.removeFriend('Aviv');
      expect(friendsList.friends[0]).toBeUndefined();
    });

    it('should throw an error as friend does not exists', () => {
       expect(() => friendsList.removeFriend('Aviv')).toThrow(new Error('Friend not found!'))
    });
  })

});