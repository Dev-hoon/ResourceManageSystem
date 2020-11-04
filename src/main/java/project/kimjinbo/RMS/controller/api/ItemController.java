package project.kimjinbo.RMS.controller.api;

import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import project.kimjinbo.RMS.interfaces.CRUDInterface;
import project.kimjinbo.RMS.model.entity.Item;
import project.kimjinbo.RMS.model.network.Header;
import project.kimjinbo.RMS.model.network.request.ItemApiRequest;
import project.kimjinbo.RMS.model.network.response.ItemApiResponse;

import project.kimjinbo.RMS.service.ItemApiLogicService;

@RestController
@RequestMapping("/api") //localhost:8080/api
public class ItemController implements CRUDInterface<ItemApiRequest, ItemApiResponse > {
    @Autowired
    private ItemApiLogicService itemApiLogicService;

    @PostMapping("/items") // localhost:8080/api/items
    public void readItems(@RequestBody Header<ItemApiRequest> request) {
        itemApiLogicService.readWhere( request );
    }

    @GetMapping("/items") // localhost:8080/api/items
    @ResponseBody
    public Header<ItemApiResponse> readItems(ItemApiRequest itemApiRequest) {
        System.out.println("request : "+itemApiRequest);
        return itemApiLogicService.readWhere( new Header<ItemApiRequest>(itemApiRequest) );
    }

    @Override
    @GetMapping("/item") // /api/user?id={id}
    public Header<ItemApiResponse> read(@RequestParam(name = "id") Long id) {
        return itemApiLogicService.read(id);
    }

    @Override
    @PostMapping("/item")
    public Header<ItemApiResponse> create(@RequestBody Header<ItemApiRequest> request) {
        System.out.println("controller request : "+request);
        return itemApiLogicService.create( request );
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
}
