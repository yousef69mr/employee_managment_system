package com.example.soa.models;

public class Language {
    private String languageName;
    private int scoreOutof100;

    // Getters and setters


    public void setLanguageName(String languageName) {
        this.languageName = languageName;
    }

    public void setScoreOutof100(int scoreOutof100) {
        this.scoreOutof100 = scoreOutof100;
    }

    public int getScoreOutof100() {
        return scoreOutof100;
    }

    public String getLanguageName() {
        return languageName;
    }

    @Override
    public String toString() {
        return "Language{" +
                "languageName='" + languageName + '\'' +
                ", scoreOutof100=" + scoreOutof100 +
                '}';
    }
}
