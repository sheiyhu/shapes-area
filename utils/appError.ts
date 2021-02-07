class AppError extends Error {
    statusCode: number;
    status: string;

    constructor(message, statusCode) {
      super(message);
  
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    }
  }
  
export default AppError;