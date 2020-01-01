import React, { Fragment } from 'react'
import Modal from '../../components/UI/Modal/Modal'
import useHttpErrorHandler from '../../hooks/http-error-handler'

const withErrorHandler = (WrappedComponent, axios) => {
  return props => {
    
    const [error, clearError] = useHttpErrorHandler(axios)

    return (
      <Fragment>
        <Modal 
          show={error && true}  // coerce error object into a string
          modalClosed={clearError}>
          {error && error.message}
        </Modal>
        <WrappedComponent {...props} />
      </Fragment>
    )
  }
}

export default withErrorHandler