package project.kimjinbo.RMS.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import project.kimjinbo.RMS.RMSApplicationTests;
import project.kimjinbo.RMS.model.entity.Bookmark;
import project.kimjinbo.RMS.model.entity.BookmarkPK;
import project.kimjinbo.RMS.model.entity.Item;

import java.util.List;
import java.util.Optional;


public class BookmarkRepositoryTest extends RMSApplicationTests {
    @Autowired
    private BookmarkRepository bookmarkRepository;

    @Test
    public void create(){
        /*
        CategoryId cateId = new CategoryId("HW","컴퓨터","노트북");
        Category category = new Category();
        category.setSuperCate( cateId.getSuperCate() );
        category.setSubCateFirst( cateId.getSubCateFirst() );
        category.setSubCateSecond( cateId.getSubCateSecond() );
        category.setRegisteDate( LocalDate.now() );
        category.setRegisterUser( 0L );
        category.setUpdateDate( LocalDate.now() );

        Category newCate = itemRepo.save( category );*/
        //System.out.println("newCate   : "+newCate);

        System.out.println("test done!");

    }

    @Test
    public void read(){

        List<Bookmark> item = bookmarkRepository.findAll( );
        //Assert.assertTrue( item.isPresent() );

        System.out.println("item : "+item);
    }

}