package project.kimjinbo.RMS.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import project.kimjinbo.RMS.model.network.Header;


@ControllerAdvice
public class ControllerExceptionHandler {

    /*@ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleValidException(final Exception error) {
        System.out.println("error : "+error.getClass().getName());
        System.out.println("Type Error!");
        return null;
    }*/

    @ExceptionHandler(BindException.class)
    public ResponseEntity<Header> handleBindException(final BindException error) {
        return new ResponseEntity<Header>(Header.ERROR("Type Error"), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UserAuthException.class)
    public ResponseEntity<Header> handleUserAuthException(final UserAuthException error) {
        return new ResponseEntity<Header>(Header.ERROR("No User Data"), HttpStatus.BAD_REQUEST);
    }


}
