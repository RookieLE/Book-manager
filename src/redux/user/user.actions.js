export const signIn = (credentials) => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();

    firebase.auth().signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    ).then(() => {
      dispatch({type: 'LOGIN_SUCCESS'})
    }).catch(err => {
      dispatch({type: 'LOGIN_ERROR', err })
    })
  }
}

export const signInWithProvider = (provider) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    firebase.auth().signInWithPopup(provider).then((cred) => {
      dispatch({ type: 'LOGIN_WITH_GOOGLE_SUCCESS' });
      // add user signed in with google to users collection
     return firestore.collection('users').doc(cred.user.uid).set({
        displayName: cred.user.displayName,
        createdAt: new Date(),
        email: cred.user.email
      }) 
    }).catch(err => {
      dispatch({ type: 'LOGIN_WITH_GOOGLE_ERROR' },
        console.log(err))
    })
  }
}

export const signUp = (newUser) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();

    firebase.auth().createUserWithEmailAndPassword(
      newUser.email,
      newUser.password
    ).then(resp => {
      // resp.user.uid gives us the id autogenerated from the function above
      return firestore.collection('users').doc(resp.user.uid).set({
        // setting the new property inside the new doc/user
        displayName: newUser.displayName,
        createdAt: new Date(),
        email: newUser.email
      })
    }).then(() => {
      dispatch({ type: 'SIGNUP_SUCCESS' })
    }).catch(err => {
      dispatch({ type: 'SIGNUP_ERROR', err })
    })
  }
}

export const signOut = () => {
  return (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();

    firebase.auth().signOut().then(() => {
      dispatch({ type: 'SIGNOUT_SUCCESS '})
    })
  }
}