public SavedList saveList(SavedList savedList) {
    try {
        // Validate savedList if necessary
        return savedListRepository.save(savedList);
    } catch (DataIntegrityViolationException e) {
        throw new RuntimeException("Data integrity violation: " + e.getMessage());
    } catch (Exception e) {
        throw new RuntimeException("An error occurred while saving the list: " + e.getMessage());
    }
} 