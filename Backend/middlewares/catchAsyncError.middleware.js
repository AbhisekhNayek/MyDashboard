// Higher-order function to catch errors in async route handlers and pass them to error middleware
export const catchAsyncError = (theFunction) => {
  return (req, res, next) => {
    // Execute the async function and catch any errors, passing them to next()
    Promise.resolve(theFunction(req, res, next)).catch(next);
  };
};
