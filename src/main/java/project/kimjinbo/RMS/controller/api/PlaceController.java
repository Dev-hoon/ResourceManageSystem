package project.kimjinbo.RMS.controller.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;
import project.kimjinbo.RMS.interfaces.CrudInterface;
import project.kimjinbo.RMS.model.network.Header;
import project.kimjinbo.RMS.model.network.request.ItemApiRequest;
import project.kimjinbo.RMS.model.network.request.PlaceApiRequest;
import project.kimjinbo.RMS.model.network.response.ItemApiResponse;
import project.kimjinbo.RMS.model.network.response.PlaceApiResponse;
import project.kimjinbo.RMS.model.network.response.PlaceListApiResponse;
import project.kimjinbo.RMS.service.PlaceApiLogicService;

import java.util.List;

@RestController
@RequestMapping("/api") //localhost:8080/api
public class PlaceController implements CrudInterface<PlaceApiRequest, PlaceApiResponse> {

    @Autowired
    private PlaceApiLogicService placeApiLogicService;

    @GetMapping("/placeList")
    @ResponseBody
    public Header<List<PlaceListApiResponse>> readPlaceList( ) {
        return placeApiLogicService.searchList(  );
    }

    // 조건 사용 가능  localhost:8080/api/items
    @GetMapping("/places")
    @ResponseBody
    public Header<List<PlaceApiResponse>> readPlaces(@PageableDefault(sort = { "id" }, direction = Sort.Direction.ASC) Pageable pageable, PlaceApiRequest placeApiRequest) {
        return placeApiLogicService.search( pageable, placeApiRequest );
    }


    @Override
    @PostMapping("/place")
    public Header<PlaceApiResponse> create(@RequestBody Header<PlaceApiRequest> request) {
        System.out.println("controller request : "+request);
        return placeApiLogicService.create( request );
    }

    // /api/item?id={id}
    @Override
    @GetMapping("/place")
    public Header<PlaceApiResponse> read(@RequestParam(name = "id") Long id) {
        return null;
    }

    @Override
    @PutMapping("/place")
    public Header<PlaceApiResponse> update(@RequestBody Header<PlaceApiRequest> request) {
        return placeApiLogicService.update( request );
    }

    @Override
    @DeleteMapping("/place/{id}")
    public Header delete(@PathVariable(name = "id") Long id) {
        System.out.println("id : "+id);
        return placeApiLogicService.delete( id );
    }

     /*
    @GetMapping("/item/setting")
    public Header setting( ) {
        return itemApiLogicService.setting();
    }
*/
}

