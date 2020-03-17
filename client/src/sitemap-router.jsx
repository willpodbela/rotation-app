import React from 'react';
import { Route, Redirect } from 'react-router';

export default (
	<Route>
		<Route exact path="/" />
    <Route exact path="/login" />
    <Route exact path="/sign-up" />
    <Route path="/catalog">
      <Route path=":itemInfo" />
    </Route>
    <Route exact path="/account" />
    <Route exact path="/terms" />
    <Route exact path="/privacy" />
	</Route>
);
