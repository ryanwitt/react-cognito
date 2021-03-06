import React from 'react';
import { connect } from 'react-redux';
import { Action } from './actions';

const BaseEmailVerification = props =>
  React.cloneElement(props.children, {
    error: props.error,
    onSubmit: props.onSubmit,
    onCancel: props.onCancel,
  });

const verifyEmail = (verificationCode, user, dispatch) =>
  user.verifyAttribute('email', verificationCode, {
    onSuccess: () => dispatch(Action.login(user)),
    inputVerificationCode: () => dispatch(Action.emailVerificationRequired(user)),
    onFailure: error => dispatch(Action.emailVerificationFailed(user, error.message)),
  });

const mapStateToProps = state => ({
  error: state.cognito.error,
  user: state.cognito.user,
});

const mapDispatchToProps = dispatch => ({
  verifyPartial: (verificationCode, user) =>
    verifyEmail(verificationCode, user, dispatch),
  onCancel: () => dispatch(Action.logout()),
});

const mergeProps = (stateProps, dispatchProps, ownProps) =>
  Object.assign({}, ownProps, stateProps, dispatchProps, {
    onSubmit: verificationCode =>
     dispatchProps.verifyPartial(verificationCode, stateProps.user),
  });

/**
 * Wrapper for an Email Verification Form.
 * Magically adds the following props to the contained form:
 *
 *  * user - the Cognito user from the Redux store
 *  * error - the persisted error from the Redux store
 *  * onSubmit - a handler that calls the Cognito verification API
 *
 * @example
 * <EmailVerification>
 *   <EmailVerificationForm />
 * </EmailVerification>
 *
 */
export const EmailVerification = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(BaseEmailVerification);
