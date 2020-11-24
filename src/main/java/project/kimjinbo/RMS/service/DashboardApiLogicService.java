package project.kimjinbo.RMS.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import project.kimjinbo.RMS.interfaces.CrudInterface;
import project.kimjinbo.RMS.model.entity.Department;
import project.kimjinbo.RMS.model.entity.Rental;
import project.kimjinbo.RMS.model.enumclass.RentalState;
import project.kimjinbo.RMS.model.network.Header;
import project.kimjinbo.RMS.model.network.Pagination;
import project.kimjinbo.RMS.model.network.request.DepartmentApiRequest;
import project.kimjinbo.RMS.model.network.request.ItemApiRequest;
import project.kimjinbo.RMS.model.network.request.RentalApiRequest;
import project.kimjinbo.RMS.model.network.response.DepartmentApiResponse;
import project.kimjinbo.RMS.model.network.response.DepartmentListApiResponse;
import project.kimjinbo.RMS.repository.DepartmentRepository;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DashboardApiLogicService {

    @Autowired
    ItemApiLogicService itemApiLogicService;

    @Autowired
    RentalApiLogicService rentalApiLogicService;

    public Header<Object> getSetting() {
        LocalDate date = LocalDate.now();
        System.out.println( "대기요청  : "+
            rentalApiLogicService.amount(RentalApiRequest.builder().state(RentalState.RENTAL_WAIT.getId()).build()).getData()
        );
        System.out.println( "연체요청  : "+
            rentalApiLogicService.amount(
                    RentalApiRequest.builder().state(RentalState.RENTAL_WAIT.getId()).build()
            ).getData()
        );

        return Header.OK("test");
    }

}