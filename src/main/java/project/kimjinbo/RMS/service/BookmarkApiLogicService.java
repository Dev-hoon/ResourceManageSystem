package project.kimjinbo.RMS.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import project.kimjinbo.RMS.configs.BookmarkSpecs;
import project.kimjinbo.RMS.configs.ItemSpecs;
import project.kimjinbo.RMS.interfaces.CrudInterface;
import project.kimjinbo.RMS.model.entity.Bookmark;
import project.kimjinbo.RMS.model.entity.Item;
import project.kimjinbo.RMS.model.enumclass.ItemState;
import project.kimjinbo.RMS.model.enumclass.RentalState;
import project.kimjinbo.RMS.model.network.Header;
import project.kimjinbo.RMS.model.network.Pagination;
import project.kimjinbo.RMS.model.network.request.BookmarkApiRequest;
import project.kimjinbo.RMS.model.network.response.BookmarkApiResponse;
import project.kimjinbo.RMS.repository.BookmarkRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookmarkApiLogicService implements CrudInterface<BookmarkApiRequest, BookmarkApiResponse> {

    @Autowired
    private BookmarkRepository BookmarkRepository;

    @Override
    public Header<BookmarkApiResponse> create(Header<BookmarkApiRequest> request) {
        return null;
    }

    @Override
    public Header read(Long id) {
        return null;
    }

    @Override
    public Header<BookmarkApiResponse> update(Header<BookmarkApiRequest> request) {
        return null;
    }

    @Override
    public Header delete(Long id) {
        return null;
    }

    public Header<List<BookmarkApiResponse>> search(Pageable pageable, BookmarkApiRequest request) {

        Page<Bookmark> bookmarks = BookmarkRepository.findAll( BookmarkSpecs.registerUser( request.getRegisterUser() ) , pageable);

        List<BookmarkApiResponse> bookmarkApiResponse = bookmarks.stream()
                .map( item -> response(item) )
                .collect(Collectors.toList());

        Pagination pagination = Pagination.builder()
                .totalPages(bookmarks.getTotalPages())
                .totalElements(bookmarks.getTotalElements())
                .currentPage(bookmarks.getNumber())
                .currentElements(bookmarks.getNumberOfElements())
                .build();

        return Header.OK( bookmarkApiResponse , pagination );
    }

    public BookmarkApiResponse response(Bookmark bookmark){

        BookmarkApiResponse bookmarkApiResponse = BookmarkApiResponse.builder()
                .id( bookmark.getItemId())
                .registerDate(bookmark.getRegisterDate() )
                .expireDate(bookmark.getItem().getExpireDate() )
                .superCate( bookmark.getItem().getSuperCate() )
                .subCateFirst( bookmark.getItem().getSubCateFirst() )
                .subCateSecond( bookmark.getItem().getSubCateSecond() )
                .name( bookmark.getItem().getName() )
                .cost( bookmark.getItem().getCost() )
                .purchaseCost( bookmark.getItem().getPurchaseCost() )
                .memo( bookmark.getItem().getMemo() )
                .itemState( ItemState.titleOf( bookmark.getItem().getItemState()) )
                .placeState( bookmark.getItem().getPlaceState() )
                .rentalState( RentalState.titleOf(bookmark.getItem().getRentalState()) )
                .build();

        return bookmarkApiResponse;
    }

}

/*
     public Header<ItemApiResponse> readWhere(Header<ItemApiRequest> request) {
        LocalDate date = LocalDate.now();

        ItemApiRequest req = request.getData();

        List<ItemApiResponse> items = itemRepository.findAll(
                ItemSpecs.superCate(  req.getSuperCate() ).and(
                        ItemSpecs.subCateFirst(req.getSubCateFirst()) ).and(
                        ItemSpecs.subCateSecond(req.getSubCateSecond())
                )
        ).stream().map( el-> ( response(el) ) ).collect(Collectors.toList());

        return Header.OK( items.get(0) );
    }
 */