package project.kimjinbo.RMS.controller.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;
import project.kimjinbo.RMS.interfaces.CrudInterface;
import project.kimjinbo.RMS.model.network.Header;
import project.kimjinbo.RMS.model.network.request.BookmarkApiRequest;
import project.kimjinbo.RMS.model.network.request.ItemTempApiRequest;
import project.kimjinbo.RMS.model.network.response.BookmarkApiResponse;
import project.kimjinbo.RMS.model.network.response.ItemTempApiResponse;
import project.kimjinbo.RMS.repository.ItemTempRepository;
import project.kimjinbo.RMS.service.BookmarkApiLogicService;
import project.kimjinbo.RMS.service.ItemTempApiLogicService;

import java.util.List;

@RestController
@RequestMapping("/api") //localhost:8080/api
public class BookmarkController implements CrudInterface<ItemTempApiRequest, ItemTempApiRequest > {

    @Autowired
    private BookmarkApiLogicService bookmarkApiLogicService;

    @Autowired
    private ItemTempApiLogicService itemTempApiLogicService;

    @GetMapping("/bookmarks")
    @ResponseBody
    public Header<List<BookmarkApiResponse>> readItems(@PageableDefault(sort = { "item_id" }, direction = Sort.Direction.ASC) Pageable pageable, BookmarkApiRequest bookmarkApiRequest) {
        System.out.println("request : "+bookmarkApiRequest);
        return bookmarkApiLogicService.search( pageable, bookmarkApiRequest );
    }

    @GetMapping("/bookmark/amount")
    @ResponseBody
    public Header<Long> amount(@PageableDefault(sort = { "id" }, direction = Sort.Direction.ASC) Pageable pageable, ItemTempApiRequest ItemTempApiRequest) {
        System.out.println("request : "+ItemTempApiRequest);
        return itemTempApiLogicService.amount( pageable, ItemTempApiRequest );
    }

    @Override
    @GetMapping("/bookmark") // /api/temp?id={id}
    public Header read(@RequestParam(name = "id") Long id) { return itemTempApiLogicService.read(id); }

    @Override
    @PostMapping("/bookmark")
    public Header create(@RequestBody Header<ItemTempApiRequest> request) {
        return itemTempApiLogicService.create( request );
    }

    @Override
    @PutMapping("/bookmark")
    public Header update(@RequestBody Header<ItemTempApiRequest> request) {
        return itemTempApiLogicService.update( request );
    }

    @Override
    @DeleteMapping("/bookmark/{id}")
    public Header delete(@PathVariable(name = "id") Long id) {
        return itemTempApiLogicService.delete(id);
    }
}


/*
    // 조건 사용 가능  localhost:8080/api/temp
    @GetMapping("/temp")
    @ResponseBody
    public Header<List<ItemApiResponse>> readItems(@PageableDefault(sort = { "id" }, direction = Sort.Direction.ASC) Pageable pageable, ItemApiRequest itemApiRequest) {
        System.out.println("request : "+itemApiRequest);
        return itemApiLogicService.search( pageable, itemApiRequest );
    }
 */


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
