package project.kimjinbo.RMS.controller.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;
import project.kimjinbo.RMS.interfaces.CrudInterface;
import project.kimjinbo.RMS.model.network.Header;
import project.kimjinbo.RMS.model.network.request.ItemApiRequest;
import project.kimjinbo.RMS.model.network.response.ItemApiResponse;

import project.kimjinbo.RMS.service.ItemApiLogicService;

import java.util.List;

@RestController
@RequestMapping("/api") //localhost:8080/api
public class ItemController implements CrudInterface<ItemApiRequest, ItemApiResponse > {

    @Autowired
    private ItemApiLogicService itemApiLogicService;

    // 조건 사용 가능  localhost:8080/api/items
    @GetMapping("/items")
    @ResponseBody
    public Header<List<ItemApiResponse>> readItems(@PageableDefault(sort = { "id" }, direction = Sort.Direction.ASC) Pageable pageable, ItemApiRequest itemApiRequest) {
        System.out.println("request : "+itemApiRequest);
        return itemApiLogicService.search( pageable, itemApiRequest );
    }

    @Override
    @PostMapping("/item")
    public Header<ItemApiResponse> create(@RequestBody Header<ItemApiRequest> request) {
        System.out.println("controller request : "+request);
        return itemApiLogicService.create( request );
    }


    // /api/item?id={id}
    @Override
    @GetMapping("/item")
    public Header<ItemApiResponse> read(@RequestParam(name = "id") Long id) {
        return itemApiLogicService.read(id);
    }


    @Override
    @PutMapping("/item")
    public Header<ItemApiResponse> update(@RequestBody Header<ItemApiRequest> request) {
        return itemApiLogicService.update( request );
    }


    @Override
    @DeleteMapping("/item/{id}")
    public Header delete(@PathVariable(name = "id") Long id) {
        return itemApiLogicService.delete(id);
    }


    @GetMapping("/item/setting")
    public Header setting( ) {
        return itemApiLogicService.setting();
    }

}

/*
    @GetMapping("/items") // localhost:8080/api/items
    @ResponseBody
    public Header<ItemApiResponse> readItems(ItemApiRequest itemApiRequest) {
        System.out.println("request : "+itemApiRequest);
        return itemApiLogicService.readWhere( new Header<ItemApiRequest>(itemApiRequest) );
    }

    @PostMapping("/items") // localhost:8080/api/items
    public void readItems(@RequestBody Header<ItemApiRequest> request) {
        itemApiLogicService.readWhere( request );
    }
 */
