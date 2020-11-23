package project.kimjinbo.RMS.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.kimjinbo.RMS.configs.BookmarkSpecs;
import project.kimjinbo.RMS.configs.ItemSpecs;
import project.kimjinbo.RMS.interfaces.CrudInterface;
import project.kimjinbo.RMS.model.entity.Bookmark;
import project.kimjinbo.RMS.model.entity.BookmarkPK;
import project.kimjinbo.RMS.model.entity.Category;
import project.kimjinbo.RMS.model.entity.Item;
import project.kimjinbo.RMS.model.enumclass.ItemState;
import project.kimjinbo.RMS.model.enumclass.RentalState;
import project.kimjinbo.RMS.model.network.Header;
import project.kimjinbo.RMS.model.network.Pagination;
import project.kimjinbo.RMS.model.network.request.BookmarkApiRequest;
import project.kimjinbo.RMS.model.network.request.BookmarkRequest;
import project.kimjinbo.RMS.model.network.request.CateApiRequest;
import project.kimjinbo.RMS.model.network.response.BookmarkApiResponse;
import project.kimjinbo.RMS.model.network.response.BookmarkResponse;
import project.kimjinbo.RMS.repository.BookmarkRepository;

import java.awt.print.Book;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookmarkApiLogicService implements CrudInterface<BookmarkApiRequest, BookmarkApiResponse> {

    @Autowired
    private BookmarkRepository bookmarkRepository;

    @Override
    public Header create(Header<BookmarkApiRequest> request) {
        LocalDate date = LocalDate.now();

        // 1. request data
        BookmarkApiRequest bookmarkApiRequest = request.getData();

        // 2. Cate 생성
        Bookmark bookmark = Bookmark.builder()
        .registerDate( date )
        .updateDate( date )
        .updateUser( bookmarkApiRequest.getRegisterUser() )
        .registerUser( bookmarkApiRequest.getRegisterUser() )
        .itemId( bookmarkApiRequest.getItemId() )
        .memo( bookmarkApiRequest.getMemo() )
        .build();

        Bookmark newBookmark = bookmarkRepository.save( bookmark );

        return Header.OK( responseBookmark(newBookmark) );
    }

    @Override
    public Header read(Long id) {
        return null;
    }

    @Override
    public Header update(Header<BookmarkApiRequest> request) {
        LocalDate date = LocalDate.now();

        BookmarkApiRequest bookmarkApiRequest = request.getData();

        // 2. id -> department 데이터 를 찾고
        Optional<Bookmark> optional = bookmarkRepository.findById( new BookmarkPK( bookmarkApiRequest )
        );

        // 3. data -> update  id
        return optional.map( item -> {
            item
            .setUpdateDate( date )
            .setUpdateUser( bookmarkApiRequest.getUpdateUser() )
            .setMemo( bookmarkApiRequest.getMemo() );

            return item;
        })
        .map(item -> bookmarkRepository.save(item) )             // update -> newUser
        .map(item -> responseBookmark(item) )                        // userApiResponse
        .map(Header::OK)
        .orElseGet(()->Header.ERROR("데이터 없음"));
    }

    @Override
    public Header delete(Long id) { return null; }

    public Header delete( BookmarkPK bookmarkPK ) {

        Optional<Bookmark> optional = bookmarkRepository.findById( bookmarkPK );

        return optional.map( category ->{
            bookmarkRepository.delete( category );
            return Header.OK();
        }).orElseGet(()->Header.ERROR("데이터 없음"));
    }

    public Header createItems(Header<BookmarkRequest> request) {
        LocalDate date = LocalDate.now();

        // 1. request data
        BookmarkRequest bookmarkRequest = request.getData();

        System.out.println("request.getData() : "+request.getData());

        List bookmarks = bookmarkRequest.getItems().stream().map( ( item )->{
            try {
                Bookmark bookmark = Bookmark.builder()
                        .registerDate( date )
                        .updateDate( date )
                        .updateUser( bookmarkRequest.getUserId() )
                        .registerUser( bookmarkRequest.getUserId() )
                        .itemId( item )
                        .memo( bookmarkRequest.getMemo() )
                        .build();

                System.out.println("createItems bookmark : "+bookmark);

                Bookmark newBookmark = bookmarkRepository.save( bookmark );

                return newBookmark;
            } catch(Exception e) {
                return "error";
            }
        }).collect(Collectors.toList());

        System.out.println("bookmarks: "+bookmarks );

        return Header.OK( bookmarks );
    }

    @Transactional
    public Header deleteItems(Header<BookmarkRequest> request) {
        LocalDate date = LocalDate.now();

        // 1. request data
        BookmarkRequest bookmarkRequests = request.getData();

        System.out.println("request.getData() : "+request.getData());

        List bookmarks = bookmarkRequests.getItems().stream().map( ( item )->{

            try {
                System.out.println("item, bookmarkRequests.getUserId() "+item+" / "+bookmarkRequests.getUserId());
                bookmarkRepository.deleteById( new BookmarkPK( item, bookmarkRequests.getUserId() ) );
                return "deleted";
            } catch(Exception e) {
                return new RuntimeException("delete error");
            }
        }).collect(Collectors.toList());

        System.out.println("bookmarks: "+bookmarks );

        return Header.OK( bookmarks );
    }


    public Header<List<BookmarkApiResponse>> search(Pageable pageable, BookmarkApiRequest request) {

        Page<Bookmark> bookmarks = bookmarkRepository.findAll( BookmarkSpecs.registerUser( request.getRegisterUser() ) , pageable);

        List<BookmarkApiResponse> bookmarkApiResponse = bookmarks.stream()
                .map( item -> response(item) )
                .collect(Collectors.toList());

        Pagination pagination = Pagination.builder()
                .totalPages(bookmarks.getTotalPages())
                .totalElements(bookmarks.getTotalElements())
                .currentPage(bookmarks.getNumber())
                .currentElements(bookmarks.getNumberOfElements())
                .build();

        System.out.println("BookmarkApiResponse pagination : "+pagination);

        return Header.OK( bookmarkApiResponse , pagination );
    }

    public BookmarkApiResponse response(Bookmark bookmark){

        System.out.println("bookmark response : "+bookmark);

        BookmarkApiResponse bookmarkApiResponse = BookmarkApiResponse.builder()
                .itemId( bookmark.getItemId() )
                .userId( bookmark.getRegisterUser() )
                .registerDate(bookmark.getRegisterDate() )
                .expireDate(bookmark.getItem().getExpireDate() )
                .superCate( bookmark.getItem().getSuperCate() )
                .subCateFirst( bookmark.getItem().getSubCateFirst() )
                .subCateSecond( bookmark.getItem().getSubCateSecond() )
                .name( bookmark.getItem().getName() )
                .cost( bookmark.getItem().getCost() )
                .purchaseCost( bookmark.getItem().getPurchaseCost() )
                .memo( bookmark.getItem().getMemo() )
                .placeState( bookmark.getItem().getPlaceState() )
                .itemState( (bookmark.getItem().getItemState()==null)?null:ItemState.titleOf( bookmark.getItem().getItemState()) )
                .rentalState( (bookmark.getItem().getRentalState()==null)?null:RentalState.titleOf(bookmark.getItem().getRentalState()) )
                .build();

        return bookmarkApiResponse;
    }

    public BookmarkResponse responseBookmark(Bookmark bookmark){

        System.out.println("bookmark responseBookmark : "+bookmark);

        BookmarkResponse bookmarkResponse = BookmarkResponse.builder()
                .itemId( bookmark.getItemId())
                .userId( bookmark.getRegisterUser() )
                .memo(  bookmark.getMemo() )
                .build();

        return bookmarkResponse;
    }

}