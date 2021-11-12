from enum import Enum
from typing import Any, Callable
from peewee import Model, CharField

#from pydantic import BaseModel
#
#class User(UserBase):
#    id: int
#    is_active: bool
#
#    class Config:
#        orm_mode = True

class BaseModel(Model):
    class Meta:
        database = "database" # database


# class enum_field(CharField):
#     """
#     This class enable a Enum like field for Peewee
#     """
#     def __init__(self, choices, *args, **kwargs):
#         self.choices = choices
#         super(CharField, self).__init__(*args, **kwargs)

#     def db_value(self, value):
#         return value.name

#     def python_value(self, value):
#         return self.choices(value)


# class EnumField(CharField):
#     """
#     This class enable an Enum like field for Peewee
#     """

#     def __init__(self, choices: Callable, *args: Any, **kwargs: Any) -> None:
#         super(CharField, self).__init__(*args, **kwargs)
#         self.choices = choices
#         self.max_length = 255

#     def db_value(self, value: Any) -> Any:
#         return value.value

#     def python_value(self, value: Any) -> Any:
#         return self.choices(type(list(self.choices)[0].value)(value))


class EnumField(CharField):
    """CharField-based enumeration field."""

    def __init__(self, enum, *args, max_length=None, null=None, **kwargs):
        """Initializes the enumeration field with the possible values.

        :enum: The respective enumeration.
        :max_length: Ignored.
        :null: Ignored.
        """
        super().__init__(*args, max_length=max_length, null=null, **kwargs)
        self.enum = enum

    @property
    def enum(self):
        """Returns the enumeration values."""
        return self._enum

    @enum.setter
    def enum(self, enum):
        """Sets the enumeration values."""
        self._enum = enum if is_enum(enum) else set(enum)

    @property
    def values(self):
        """Yields appropriate database values."""
        if is_enum(self.enum):
            for item in self.enum:
                yield item.value
        else:
            for value in self.enum:
                yield value

    @property
    def max_length(self):
        """Derives the required field size from the enumeration values."""
        return max(len(value) for value in self.values if value is not None)

    @max_length.setter
    def max_length(self, max_length):
        """Mockup to comply with super class' __init__."""
        if max_length is not None:
            LOGGER.warning(
                'Parameter max_length=%s will be ignored since it '
                'is derived from enumeration values.', str(max_length))

    @property
    def null(self):
        """Determines nullability by enum values."""
        return any(value is None for value in self.values)

    @null.setter
    def null(self, null):
        """Mockup to comply with super class' __init__."""
        if null is not None:
            LOGGER.warning(
                'Parameter null=%s will be ignored since it '
                'is derived from enumeration values.', str(null))

    def db_value(self, value):
        """Coerce enumeration value for database."""
        if is_enum(value):
            if value in self.enum:
                return value.value
        elif value in self.values:
            return value

        raise InvalidEnumerationValue(value)

    def python_value(self, value):
        """Coerce enumeration value for python."""
        if is_enum(self.enum):
            for item in self.enum:
                if item.value == value:
                    return item
        elif value in self.values:
            return value

        raise InvalidEnumerationValue(value)


def is_enum(obj):
    """Determines whether the object is an enum.Enum."""

    try:
        return issubclass(obj, Enum)
    except TypeError:
        return False


class InvalidEnumerationValue(ValueError):
    """Indicates that an invalid enumeration value has been specified."""

    def __init__(self, value):
        super().__init__('Invalid enum value: "{}".'.format(value))
