import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}))


function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [openSignin, setOpenSignin] = useState(false);
  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //user logged in
        setUser(authUser);
      } else {
        //user logged out
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    }
  }, [user, username]);

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);
  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        })
      })
      .catch((error) => alert(error.message));
  }
  const signIn = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignin(false);
  }
  return (
    <div className="App">
      
     
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className='app_signup'>
            <center>
              <img
                className="app_headerImage"
                src={logo}
                alt="Instagram"
              />
            </center>
            <Input
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type='submit' onClick={signUp}>Sign Up</Button>

          </form>

        </div>
      </Modal>
      <Modal
        open={openSignin}
        onClose={() => setOpenSignin(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className='app_signup'>
            <center>
              <img
                className="app_headerImage"
                src={logo}
                alt="Instagram"
              />
            </center>
            <Input
              placeholder="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type='submit' onClick={signIn}>Sign In</Button>

          </form>

        </div>
      </Modal>

      <div className="app_header">
        <img
          className="app_headerImage"
          src={logo}
          alt="Instagram"
        />
            {user ? (
        <Button type='submit' onClick={() => auth.signOut()}>Log Out</Button>
      ) : (
        <div className="app_loginContainer">
          <Button type='submit' onClick={() => setOpenSignin(true)}>Sign In</Button>
          <Button onClick={() => setOpen(true)}>Sign up</Button>
        </div>

      )}
      </div>
      <div className="app_posts">
        <div className="app_posts_left">
        {
        posts.map(({ id, post }) => (
          <Post key={id} postId = {id} username={post.username} user = {user} caption={post.caption} imageUrl={post.imageUrl} />
        ))
      }
          </div>     
          <div className="app_posts_right">
          <InstagramEmbed
          url='https://instagr.am/p/Zw9o4/'
          clientAccessToken='123|456'
          maxWidth={320}
          hideCaption={false}
          containerTagName='div'
          protocol=''
          injectScript
          onLoading={() => {}}
          onSuccess={() => {}}
          onAfterRender={() => {}}
          onFailure={() => {}}
      />

          </div>
       
      </div>
      

      {user?.displayName?(
         <ImageUpload username={user.displayName}/>
      ):(
        <h3>Sorry!!! Login to upload</h3>
      )}
    </div>
  );
}

export default App;
