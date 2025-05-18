import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;

@PostMapping("/lists")
public ResponseEntity<?> saveList(@RequestBody SavedList savedList) {
    try {
        SavedList saved = listService.saveList(savedList);
        return ResponseEntity.ok(saved);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                             .body("Failed to save list: " + e.getMessage());
    }
}

@ExceptionHandler(Exception.class)
public ResponseEntity<String> handleException(Exception e) {
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                         .body("Error: " + e.getMessage());
} 