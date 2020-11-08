package project.kimjinbo.RMS.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import project.kimjinbo.RMS.model.entity.Bookmark;
import project.kimjinbo.RMS.model.entity.BookmarkPK;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, BookmarkPK> {

}

