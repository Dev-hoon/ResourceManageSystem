package project.kimjinbo.RMS.controller.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;
import project.kimjinbo.RMS.interfaces.CrudInterface;
import project.kimjinbo.RMS.model.enumclass.RentalState;
import project.kimjinbo.RMS.model.network.Header;
import project.kimjinbo.RMS.model.network.request.RentalApiRequest;
import project.kimjinbo.RMS.model.network.request.RentalRequest;
import project.kimjinbo.RMS.model.network.response.RentalApiResponse;
import project.kimjinbo.RMS.service.RentalApiLogicService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api") //localhost:8080/api
public class RentalController implements CrudInterface<RentalApiRequest, RentalApiResponse> {

    @Autowired
    private RentalApiLogicService rentalApiLogicService;

    @PostMapping("/rentals")
    public Header<RentalApiResponse> createItems(@RequestBody Header<RentalRequest> request) {
        return rentalApiLogicService.createItems( request );
    }

    @GetMapping("/rentals/amount")
    @ResponseBody
    public Header<RentalApiResponse> amount (@PageableDefault(sort = { "startDate" }, direction = Sort.Direction.ASC) RentalApiRequest request) {
        return rentalApiLogicService.amount( request );
    }

    @PutMapping("/rentals/accept")
    public Header<RentalApiResponse> acceptItems(@RequestBody Header<List<RentalApiRequest>> request) {
        System.out.println("request : "+request);
        return rentalApiLogicService.updateState( request, RentalState.RENTAL_ACCEPT );
    }

    @PutMapping("/rentals/deny")
    public Header<RentalApiResponse> denyItems(@RequestBody Header<List<RentalApiRequest>> request) {
        return rentalApiLogicService.updateState( request, RentalState.RENTAL_DENY );
    }

    @PutMapping("/rentals/return")
    public Header<RentalApiResponse> returnItems(@RequestBody Header<List<RentalApiRequest>> request) {
        return rentalApiLogicService.updateState( request, RentalState.rentalState );
    }

    @GetMapping("/rentals")
    @ResponseBody
    public Header<RentalApiResponse> readItems (@PageableDefault(sort = { "startDate" }, direction = Sort.Direction.ASC) Pageable pageable, RentalApiRequest request) {
        return rentalApiLogicService.search( pageable, request );
    }

    @GetMapping("/rental/requests")
    @ResponseBody
    public Header<RentalApiResponse> readRequests (@PageableDefault(sort = { "startDate" }, direction = Sort.Direction.ASC) Pageable pageable, RentalApiRequest request) {
        request.setState( RentalState.RENTAL_WAIT.getId() );
        return rentalApiLogicService.search( pageable, request );
    }

    @GetMapping("/rental/overdue")
    @ResponseBody
    public Header<RentalApiResponse> readOverdue (@PageableDefault(sort = { "startDate" }, direction = Sort.Direction.ASC) Pageable pageable, RentalApiRequest request) {
        request.setEndDate( LocalDate.now() );
        request.setState( RentalState.RENTAL_ACCEPT.getId() );
        return rentalApiLogicService.search( pageable, request );
    }

    @GetMapping("/rental/history")
    @ResponseBody
    public Header<RentalApiResponse> readHistroy (@PageableDefault(sort = { "startDate" }, direction = Sort.Direction.ASC) Pageable pageable, RentalApiRequest request) {
        System.out.println( "request : "+request);
        return rentalApiLogicService.search( pageable, request );
    }


    @Override
    @PostMapping("/rental")
    public Header<RentalApiResponse> create(@RequestBody Header<RentalApiRequest> request) {
        return rentalApiLogicService.create( request );
    }

    @Override
    @PutMapping("/rental")
    public Header<RentalApiResponse> update(Header<RentalApiRequest> request) {
        return rentalApiLogicService.update( request );
    }

    @DeleteMapping("/rental")
    public Header delete(@RequestBody Header<RentalApiRequest> request ) {
        return rentalApiLogicService.delete( request );
    }

    @Override
    public Header<RentalApiResponse> read(Long id) {
        return null;
    }

    @Override
    public Header delete(Long id) {
        return null;
    }
}
