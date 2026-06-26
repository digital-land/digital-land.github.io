import re
import yaml


class Frontmatter:
    _PATTERN = re.compile(r"^---[ \t]*\r?\n(.*?)\r?\n---[ \t]*\r?\n", re.DOTALL)

    @classmethod
    def read_file(cls, filename):
        with open(str(filename), "r", encoding="utf-8") as f:
            return cls.read(f.read())

    @classmethod
    def read(cls, text):
        match = cls._PATTERN.match(text)
        if match:
            fm_str = match.group(1)
            return {
                "attributes": yaml.safe_load(fm_str) or {},
                "body": text[match.end():],
                "frontmatter": fm_str,
            }
        return {"attributes": {}, "body": text, "frontmatter": ""}
